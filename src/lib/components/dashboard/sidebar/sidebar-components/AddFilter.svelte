<script lang="ts">
	//@ts-ignore
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores'; //@ts-ignore
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import CloseButton from 'flowbite-svelte/CloseButton.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore

	import FilterDropdown from './filter-components/FilterDropdown.svelte';
	import FilterRange from './filter-components/FilterRange.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();
	type DataItem = { [key: number]: number };

	let distinctValuesObject: Array<any>;
	let max: number = 1;
	let min: number = 0;
	let dataValue: string | number | object;
	let selectedColumns: string[] = [];
	let selectedColumn: string = 'Add Field';

	let showRange = false;
	let showDropdown = false;

	const addColumnToFilter = (column: string) => {
		selectedColumn = column;
		if (selectedColumns.includes(column)) {
			selectedColumns = selectedColumns.filter((item) => item !== column);
		} else {
			selectedColumns = [...selectedColumns, column];
		}
		handleAsyncOperations(column);
	};

	const handleAsyncOperations = async (column: string) => {
		let chart = $allCharts[$i];
		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			var correctColumn = checkNameForSpacesAndHyphens(column);
			const randomValue = await $duckDBInstanceStore.query(
				`SELECT ${correctColumn} as column FROM ${filename} ORDER BY RANDOM() LIMIT 1`
			);
			var formattedData = formatData(randomValue);
			addComponentToFilter(formattedData, correctColumn, filename);
		}
	};

	const addComponentToFilter = async (
		formattedData: any,
		correctColumn: string,
		filename: string
	) => {
		dataValue = formattedData[0].column;
		if (typeof dataValue === 'string') {
			const distinctValues = await $duckDBInstanceStore.query(
				`SELECT DISTINCT ${correctColumn} as distinctValues FROM ${filename}`
			);
			distinctValuesObject = formatData(distinctValues).map((value: any) => value.distinctValues);
			showDropdown = true;
		} else if (typeof dataValue === 'number') {
			const histResp = await $duckDBInstanceStore.query(
				`SELECT histogram(${correctColumn}) as hist FROM ${filename}`
			);

			var histResponse = formatData(histResp).map((value: any) => value.hist);
			findFrequencies(histResponse, 100);
			showRange = true;
		}
	};

	function formatData(res: any) {
		const results = JSON.parse(
			JSON.stringify(
				res,
				(_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
			)
		);
		return results;
	}

	function findFrequencies(arr: DataItem[], maxBins: number): { [key: string]: number } {
		let frequencies: { [key: string]: number } = {};

		let min: number = Infinity;
		let max: number = -Infinity;
		arr.forEach((item) => {
			for (let key in item) {
				if (item[key] < min) min = item[key];
				if (item[key] > max) max = item[key];
			}
		});
		let range: number = max - min;
		let binSize: number = range / maxBins;
		if (maxBins > arr.length) {
			binSize = range / arr.length;
		}

		arr.forEach((item) => {
			for (let key in item) {
				frequencies[key] = (frequencies[key] || 0) + 1;
			}
		});
		return frequencies;
	}
</script>

<div class="w-full p-4 bg-gray-500">
	<div class="flex justify-between items-center">
		<Button>{selectedColumn}</Button>
		<Dropdown>
			{#each $columns as column}
				<DropdownItem on:click={() => addColumnToFilter(column)}>{column}</DropdownItem>
			{/each}
		</Dropdown>
		<CloseButton />
	</div>
	<div class="mt-4">
		{#if showRange}
			<FilterRange min={0} max={10} />
		{:else if showDropdown}
			<FilterDropdown />
		{/if}
	</div>
</div>
