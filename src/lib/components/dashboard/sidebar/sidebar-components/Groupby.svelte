<script lang="ts">
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex
	} from '$lib/io/Stores';
	import CarrotDown from '$lib/components/ui/icons/CarrotDown.svelte';
	import CarrotUp from '$lib/components/ui/icons/CarrotUp.svelte';
	import { onDestroy } from 'svelte';
	import { Tags } from '$lib/components/ui/tags';
	import Aggregator from './Aggregator.svelte';

	let dropdownContainer: HTMLElement;
	let container: HTMLElement;

	let tags: Array<string> = [];
	let selectedButtons: Array<string> = [];
	let isGroupByDropdownOpen: boolean = false;
	let showGroupByAggregator: boolean = false;

	$: columns = getColumnsFromFile();
	$: clickChart = clickedChart();
	$: i = clickedChartIndex();

	$: if ($allCharts.length > 0 && $allCharts[$i]?.groupbyColumns) {
		tags = $allCharts[$i].groupbyColumns;
	}

	$: if ($clearChartOptions && tags.length > 0 && $clickChart?.groupbyColumns) {
		tags = [];
		let chart: Chart = $allCharts[$i];
		chart.groupbyColumns = [];
		$allCharts[$i] = chart;
	}
	const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			isGroupByDropdownOpen = false;
		}
	};
	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isGroupByDropdownOpen = false;
		}
	};

	$: {
		if (isGroupByDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	const addColumnToGroupBy = (column: string) => {
		let chart = $allCharts[$i];
		if (selectedButtons.includes(column)) {
			selectedButtons = selectedButtons.filter((item) => item !== column);
			tags = tags.filter((tag) => tag !== column);
			chart.groupbyColumns = tags;
		} else {
			selectedButtons.push(column);
			tags = [...tags, column];
			chart.groupbyColumns = tags;
		}

		$allCharts[$i] = chart;
	};

	const removeTag = (tag: string) => {
		tags = tags.filter((item) => item !== tag);
		let chart = $allCharts[$i];
		chart.groupbyColumns = tags;
		$allCharts[$i] = chart;
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
		document.removeEventListener('keydown', handleEscapeKey);
	});
</script>

<div class="flex justify-between items-center w-full bg-neutral-900/80 shadow-lg rounded-md">
	<div class="w-full rounded-sm hover:bg-neutral-900/30 flex-grow flex">
		<div class="flex items-center">
			<span class="text-xs flex-shrink-0 ml-1 text-neutral-300">Aggregates</span>

			<button
				class="flex-grow flex justify-center items-center border border-neutral-700 hover:border-neutral-600 ml-2 px-10"
				on:click={() => {
					isGroupByDropdownOpen = !isGroupByDropdownOpen;
				}}
			>
				<span class="text-xs text-white">Choose Fields</span>
			</button>

			<button
				class="flex-shrink-0 flex items-center ml-1"
				on:click={() => {
					showGroupByAggregator = !showGroupByAggregator;
				}}
			>
				{#if !showGroupByAggregator}
					<CarrotDown class="h-6 w-6 hover:text-neutral-400" />
				{:else}
					<CarrotUp class="h-6 w-6 hover:text-neutral-400" />
				{/if}
			</button>
		</div>
	</div>
</div>
<div>
	{#if isGroupByDropdownOpen}
		<button
			bind:this={dropdownContainer}
			class="scrollBarDiv absolute top-0 left-0 mt-5 border shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			on:click|stopPropagation={() => {
				isGroupByDropdownOpen = false;
			}}
		>
			{#each $columns as column (column)}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => {
						addColumnToGroupBy(column);
						showGroupByAggregator = true;
					}}
				>
					{column}
				</button>
			{/each}
		</button>
	{/if}

	{#if showGroupByAggregator}
		<div class="-mt-1 bg-neutral-900">
			<Tags items={tags} removeItem={removeTag} />
			<Aggregator />
		</div>
	{/if}
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
		max-height: 200px; /* Adjust this value to your desired maximum height */
		overflow-y: auto;
	}
</style>
