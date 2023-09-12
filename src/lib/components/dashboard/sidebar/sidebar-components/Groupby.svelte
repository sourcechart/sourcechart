<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex
	} from '$lib/io/Stores';

	import Tags from '$lib/components/ui/tags/Tags.svelte';

	let tags: Array<string> = [];
	let selectedButtons: Array<string> = [];
	let isGroupByOpen: boolean = false;

	//export let ButtonName: string;

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
</script>

<!-- Dropdown Button -->
<button
	class="h-6 w-full bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-150 ease-in-out"
	on:click={() => {
		isGroupByOpen = !isGroupByOpen;
	}}
>
	Choose Field
</button>

<!-- Dropdown Content -->
<div
	class={`
			 scrollBarDiv bg-gray-800 absolute w-full mt-2 border border-gray-700
			 rounded shadow-lg transform transition-transform 
			 origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isGroupByOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
>
	{#each $columns as column}
		<button
			class="block w-full text-left text-white hover:bg-gray-700 transition duration-150 ease-in-out"
			on:click={() => {
				addColumnToGroupBy(column);
			}}
		>
			{column}
		</button>
	{/each}
</div>
<Tags items={tags} removeItem={removeTag} />

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
</style>
