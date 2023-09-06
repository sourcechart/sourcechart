<script lang="ts">
	import Button from 'flowbite-svelte/Button.svelte';
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex,
		groupbyColumns
	} from '$lib/io/Stores';

	let tags: Array<string> = [];
	let selectedButtons: Array<string> = []; // <-- Use an array instead of a single value

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
		if (selectedButtons.includes(column)) {
			selectedButtons = selectedButtons.filter((item) => item !== column);
		} else {
			selectedButtons.push(column);
		}

		let chart = $allCharts[$i];
		if (column) {
			tags = [...tags, column];
			chart.groupbyColumns = tags;
			$groupbyColumns = tags;
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
				on:click={() => addColumnToGroupBy(column)}
			>
				{column}
			</Button>
		{/each}
	</div>
</div>
