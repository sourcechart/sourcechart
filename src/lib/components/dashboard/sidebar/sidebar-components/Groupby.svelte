<script lang="ts">
	//@ts-ignore
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex
	} from '$lib/io/Stores';

	import { onDestroy } from 'svelte';
	import Tags from '$lib/components/ui/tags/Tags.svelte';

	let dropdownContainer: HTMLElement;

	let tags: Array<string> = [];
	let selectedButtons: Array<string> = [];
	let isGroupByOpen: boolean = false;

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
			closeDropdown();
		}
	};

	$: {
		if (isGroupByOpen) {
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

	const toggleDropdown = () => {
		isGroupByOpen = !isGroupByOpen;
	};

	const closeDropdown = () => {
		isGroupByOpen = false;
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<!-- Dropdown Button -->

<div class="w-full p-4 rounded-sm relative selectFieldColor">
	<button
		bind:this={dropdownContainer}
		class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
		on:click={toggleDropdown}
	>
		<span class="text-sm ml-2"> Fields </span>
	</button>

	{#if isGroupByOpen}
		<button
			class={`
            scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border
            rounded shadow-lg transform transition-transform 
            origin-top overflow-y-auto overflow-x-hidden z-10 
            ${isGroupByOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
			on:click|stopPropagation={closeDropdown}
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
	<div class="mt-4 flex-grow">
		{#if tags.length > 0}
			<span class="text-sm"> Columns </span>
			<Tags items={tags} removeItem={removeTag} />
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
