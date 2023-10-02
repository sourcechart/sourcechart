<script lang="ts">
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex,
		showGroupByAggregator
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

	$: {
		if (isGroupByDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
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

	const addColumnToGroupBy = (column: string) => {
		let chart = $allCharts[$i];
		if (selectedButtons.includes(column)) {
			selectedButtons = selectedButtons.filter((item) => item !== column);
			tags = tags.filter((tag) => tag !== column);
		} else if (!tags.includes(column)) {
			// Explicitly check if column isn't in tags
			selectedButtons.push(column);
			tags.push(column);
		}
		chart.groupbyColumns = tags;
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
	let showGroupByTooltip: boolean = false;
	let hoverTimeout: NodeJS.Timeout;

	const startGroupByHover = (): void => {
		hoverTimeout = setTimeout(() => {
			showGroupByTooltip = true;
		}, 3000);
	};

	const endGroupByHover = (): void => {
		clearTimeout(hoverTimeout);
		showGroupByTooltip = false;
	};
</script>

<div bind:this={container} class="relative">
	<div
		class="flex items-center w-full bg-neutral-900/80 hover:bg-neutral-900/50 shadow-lg border border-1 border-neutral-700/50"
		on:mouseover={startGroupByHover}
		on:mouseout={endGroupByHover}
		on:blur={() => {
			null;
		}}
		on:focus={() => {
			null;
		}}
	>
		<button
			class="flex-grow text-left mb-1"
			on:click={(event) => {
				isGroupByDropdownOpen = !isGroupByDropdownOpen;
				event.stopPropagation();
			}}
		>
			<span class="text-sm ml-1 text-neutral-300"> Groupby </span>
		</button>

		<button
			class="flex-shrink-0"
			on:click={() => {
				$showGroupByAggregator = !$showGroupByAggregator;
			}}
		>
			{#if !$showGroupByAggregator}
				<CarrotDown class="h-6 w-6 hover:text-neutral-400 ml-4" />
			{:else}
				<CarrotUp class="h-6 w-6 hover:text-neutral-400 ml-4" />
			{/if}
		</button>
		<!--
	{#if showGroupByTooltip}
		<div
			role="tooltip"
			class="absolute left-0 transform -translate-y-1/2 p-2 bg-neutral-200 text-gray-700 text-xs rounded shadow-md"
		>
			Click to select columns for grouping.
		</div>
	{/if}
	-->
	</div>

	{#if isGroupByDropdownOpen}
		<div
			bind:this={dropdownContainer}
			class="scrollBarDiv absolute top-full left-0 rounded-md bg-neutral-900 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
		>
			{#each $columns as column (column)}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300 truncate"
					on:click={() => {
						addColumnToGroupBy(column);
						showGroupByAggregator.set(true);
					}}
				>
					{column}
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if $showGroupByAggregator}
	<div class="-mt-1 bg-[#1c1c1c]">
		<Tags items={tags} removeItem={removeTag} />
	</div>
	<div class="mt-3">
		<span class="text-sm -mb-1 ml-1">Aggregate</span>
		<Aggregator />
	</div>
{/if}

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 4px; /* Change this value to make the scrollbar thinner or thicker */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 2px; /* Adjust the border-radius as per the new width */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin; /* This property can have values of "none", "auto", "thin", and "wide" */
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
	}
</style>
