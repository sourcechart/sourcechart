<script lang="ts">
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex
	} from '$lib/io/Stores';
	import CarrotDown from '$lib/components/ui/icons/CarrotDown.svelte';
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
	});
</script>

<button
	bind:this={container}
	class="flex-grow relative hover:rounded-md w-full rounded-sm flex items-center"
>
	<div class="flex justify-between items-center w-full text-neutral-300">
		<div
			class="bg-neutral-900 w-full rounded-sm hover:bg-neutral-900/50 flex-grow flex items-center"
		>
			<div class="justify-between flex items-center w-full px-1 mb-1">
				<button
					on:click={() => {
						isGroupByDropdownOpen = !isGroupByDropdownOpen;
					}}
				>
					<span class="text-sm ml-2">Aggregate Fields</span>
				</button>
				<button
					on:click={() => {
						showGroupByAggregator = !showGroupByAggregator;
					}}
				>
					<CarrotDown class="h-6 w-6" />
				</button>
			</div>
		</div>
	</div>
</button>

{#if isGroupByDropdownOpen}
	<button
		class={`
            scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border
            rounded shadow-lg transform transition-transform 
            origin-top overflow-y-auto overflow-x-hidden z-10 
            ${isGroupByDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
		on:click|stopPropagation={() => {
			isGroupByDropdownOpen = false;
		}}
	>
		{#each $columns as column (column)}
			<button
				class="block w-full text-left px-3 py-2 hover:bg-gray-200"
				on:click={() => {
					addColumnToGroupBy(column);
				}}
			>
				{column}
			</button>
		{/each}
	</button>
{/if}

{#if tags.length > 0 || showGroupByAggregator}
	<div class="flex-grow">
		<span class="text-sm"> Columns </span>
		<Tags items={tags} removeItem={removeTag} />
	</div>
	<Aggregator />
{/if}

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

	.selectFieldColor {
		background-color: #33333d;
	}
</style>
