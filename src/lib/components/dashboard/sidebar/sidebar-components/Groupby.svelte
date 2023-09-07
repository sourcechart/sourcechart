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
	import { ChevronUpSolid, ChevronDownSolid } from 'flowbite-svelte-icons';

	let tags: Array<string> = [];
	let selectedButtons: Array<string> = [];
	let isDropdownOpen = false; // <-- Add this line to track dropdown state

	export let ButtonName: string;

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

<div>
	<div class="space-y-1 space-x-1">
		{#each $columns as column}
			<Button
				pill={false}
				outline
				color={selectedButtons.includes(column) ? 'primary' : 'light'}
				on:click={() => {
					addColumnToGroupBy(column);
				}}
			>
				{column}
			</Button>
		{/each}
	</div>
</div>
