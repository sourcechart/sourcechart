<script lang="ts">
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import FilterDropdown from './FilterDropdown.svelte';
	import FilterRange from './FilterRange.svelte'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';

	let frequencies: { [key: string]: number } = {};
	let distinctValuesObject: Array<any>;
	let dataValue: string | number | object;
	let selectedColumns: string[] = [];
	let selectedColumn: string = 'Add Field';
	let showRange = false;
	let showDropdown = false;
	let min: number;
	let max: number;

	let isDropdownOpen: boolean = false;

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
			distinctValuesObject = distinctValuesObject.filter((item) => item != null && item != '');
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

	const handleClose = () => {
		showDropdown = false;
		showRange = false;
		selectedColumn = 'Add Field';
		selectedColumns = [];
	};

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>

<div class="w-full p-4 selectFieldColor rounded-sm">
	<div class="flex justify-between items-center">
		<div class="relative group" on:click={toggleDropdown} on:keypress={null}>
			<button class="bg-gray-200 px-3 py-2 rounded text-black hover:bg-gray-300">
				{selectedColumn}
			</button>
			<div
				class={`
			 scrollBarDiv bg-gray-900 absolute w-full mt-2  border
			 rounded shadow-lg transform transition-transform 
			 origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
			>
				{#each $columns as column (column)}
					<button
						class="block w-full text-left px-3 py-2 dark:text-black hover:bg-gray-200"
						on:click={() => {
							addColumnToFilter(column);
						}}
					>
						{column}
					</button>
				{/each}
			</div>
		</div>
		<button on:click={handleClose}>
			<svg
				class="w-6 h-6 text-gray-800 dark:text-white"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 14 14"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
				/>
			</svg>
		</button>
	</div>
	<div class="mt-4">
		{#if showRange}
			<Label>Values Ranges</Label>
			<FilterRange {min} {max} column={selectedColumn} />
		{:else if showDropdown}
			<span class="text-sm" />
			<Label>Select Value</Label>
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
		background-color: rgb(18, 18, 18);
	}
</style>
