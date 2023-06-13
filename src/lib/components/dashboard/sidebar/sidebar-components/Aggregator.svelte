<script lang="ts">
	import { allCharts, clickedChartIndex, clickedChart, clearChartOptions } from '$lib/io/stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	let selected: string | null = null;
	let aggs = ['avg', 'max', 'min', 'sum', 'count'];

	$: i = clickedChartIndex();
	$: clickChart = clickedChart();
	$: $clearChartOptions, (selected = null);

	$: if ($clickChart?.aggregator) {
		selected = $clickChart.aggregator;
	}

	function setAggregator() {
		let chart = $allCharts[$i];
		chart.aggregator = selected;
		$allCharts[$i] = chart;
	}
</script>

<Button />
<Dropdown
	class="text-center font-medium inline-flex items-center justify-center text-sm text-black dark:bg-gray-800 dark:text-gray-600 hover:text-blue-700 focus:text-blue-700 dark:focus:text-gray-800"
>
	{#each aggs as agg}
		<DropdownItem on:click={setAggregator}>
			{#if (selected = null)}
				{null}
			{:else}
				{agg}
			{/if}
		</DropdownItem>
	{/each}
</Dropdown>
