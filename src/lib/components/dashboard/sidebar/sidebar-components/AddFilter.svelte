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

	let histogram: Array<any>;
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
			const maxResp = await $duckDBInstanceStore.query(
				`SELECT max(${correctColumn}) as maxValue FROM ${filename}`
			);
			const minResp = await $duckDBInstanceStore.query(
				`SELECT min(${correctColumn}) as minValue FROM ${filename}`
			);

			const histResp = await $duckDBInstanceStore.query(
				`SELECT histogram(${correctColumn}) as hist FROM ${filename}`
			);

			var histResponse: number[] = Object.values(
				formatData(histResp).map((value: any) => value.hist)
			);
			if (histResponse.length > 100) {
				histogram = computeHistogram(histResponse, 100);
			} else {
				histogram = computeHistogram(histResponse, histResponse.length);
			}
			console.log(histogram, histResponse);
			var maxObject = formatData(maxResp);
			var minObject = formatData(minResp);
			max = maxObject[0].maxValue;
			min = minObject[0].minValue;
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

	function computeHistogram(
		data: number[],
		binCount: number
	): { bin: number; rangeStart: number; rangeEnd: number; frequency: number }[] {
		data = Object.values(data[0]);

		let min = Math.min(...data);
		let max = Math.max(...data);

		let binWidth = (max - min) / binCount;

		let bins = Array(binCount).fill(0);
		let ranges = Array(binCount)
			.fill(null)
			.map((_, index) => ({
				rangeStart: min + index * binWidth,
				rangeEnd: min + (index + 1) * binWidth
			}));

		for (let value of data) {
			let binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
			bins[binIndex]++;
		}

		return bins.map((frequency, index) => ({
			bin: index,
			rangeStart: ranges[index].rangeStart,
			rangeEnd: ranges[index].rangeEnd,
			frequency
		}));
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
