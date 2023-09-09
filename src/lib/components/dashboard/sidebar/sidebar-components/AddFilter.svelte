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

	let frequencies: { [key: string]: number } = {};
	let distinctValuesObject: Array<any>;
	let dataValue: string | number | object;
	let selectedColumns: string[] = [];
	let selectedColumn: string = 'Add Field';
	let showRange = false;
	let showDropdown = false;
	let min: number;
	let max: number;

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

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
			const minResp = await $duckDBInstanceStore.query(
				`SELECT MIN(${correctColumn}) as min FROM ${filename}`
			);
			const maxResp = await $duckDBInstanceStore.query(
				`SELECT MAX(${correctColumn}) as max FROM ${filename}`
			);

			min = formatData(minResp)[0].min;
			max = formatData(maxResp)[0].max;
			const histResp = await $duckDBInstanceStore.query(
				`SELECT histogram(${correctColumn}) as hist FROM ${filename}`
			);
			var histResponse = formatData(histResp).map((value: any) => value.hist);
			findFrequencies(histResponse, 20);
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

	function findFrequencies(arr: { [key: number]: number }[], maxBins: number): void {
		let minRange: number = Infinity;
		let maxRange: number = -Infinity;

		arr.forEach((item) => {
			for (let key in item) {
				if (item[key] < minRange) minRange = item[key];
				if (item[key] > maxRange) maxRange = item[key];
			}
		});
		let range: number = maxRange - minRange;
		let binSize: number = range / maxBins;
		if (maxBins > arr.length) {
			binSize = range / arr.length;
		}

		arr.forEach((item) => {
			for (let key in item) {
				frequencies[key] = (frequencies[key] || 0) + 1;
			}
		});
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
			<FilterRange {min} {max} {frequencies} column={selectedColumn} />
		{:else if showDropdown}
			<FilterDropdown column={selectedColumn} />
		{/if}
	</div>
</div>
