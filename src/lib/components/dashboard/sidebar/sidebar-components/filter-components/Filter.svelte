<script lang="ts">
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import FilterDropdown from './FilterDropdown.svelte';
	import FilterRange from './FilterRange.svelte';
	import { onDestroy } from 'svelte';
	import { CloseSolid } from 'flowbite-svelte-icons';

	let dropdownContainer: HTMLElement;
	let frequencies: { [key: string]: number } = {};
	let distinctValuesObject: Array<any>;
	let dataValue: string | number | object;
	let selectedColumns: string[] = [];
	let selectedColumn: string = 'Add Field';
	let showRange = false;
	let showValueDropdown = false;
	let showFieldDropdown = false;
	let min: number;
	let max: number;

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	$: {
		if (showFieldDropdown) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			showFieldDropdown = false;
		}
	};

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
			distinctValuesObject = distinctValuesObject.filter((item) => item != null && item != '');
			showValueDropdown = true;
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
	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div class="w-full p-4 selectFieldColor rounded-sm shadow-xl relative">
	<div class="justify-between items-center text-gray-400">
		<button
			bind:this={dropdownContainer}
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={() => {
				showFieldDropdown = !showFieldDropdown;
			}}
		>
			<span class="text-smml-2"> {selectedColumn}</span>
		</button>
		{#if showFieldDropdown}
			<div
				class="scrollBarDiv bg-gray-900 absolute left-0 w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each $columns as column (column)}
					<button
						class="block w-full text-left px-3 py-2 hover:bg-gray-200"
						on:click={() => {
							addColumnToFilter(column);
						}}
					>
						{column}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="mt-4">
		{#if showRange}
			<span> Values Ranges</span>
			<FilterRange {min} {max} column={selectedColumn} />
		{:else if showValueDropdown}
			<span class="text-sm"> Select Value</span>
			<FilterDropdown column={selectedColumn} items={distinctValuesObject} />
		{/if}
	</div>
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}

	.selectFieldColor {
		background-color: #33333d;
	}
</style>
