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
</script>

<button
	class="h-6 bg-gray-800 rounded-none"
	on:click={() => {
		isGroupByOpen = !isGroupByOpen;
	}}
>
	GroupbyColumn
</button>
<div
	class={`
			 scrollBarDiv bg-gray-900 absolute w-full mt-2  border
			 rounded shadow-lg transform transition-transform 
			 origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isGroupByOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
>
	{#each $columns as column}
		<button
			class="block w-full text-left px-3 py-2 dark:text-black hover:bg-gray-200"
			on:click={() => {
				addColumnToGroupBy(column);
			}}
		>
			{column}
		</button>
		=
	{/each}
</div>
