<script lang="ts">
	import { allCharts, clickedChartIndex, clickedChart, clearChartOptions } from '$lib/io/stores';
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

<div
	class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 hover:text-blue-700 focus:text-blue-700 dark:focus:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:bg-transparent dark:border-gray-800 dark:hover:border-gray-700 rounded-lg"
>
	Choose Y Axis Aggregator
</div>
<form>
	<select bind:value={selected} on:change={setAggregator}>
		{#each aggs as agg}
			<option value={agg}>
				{#if (selected = null)}
					{null}
				{:else}
					{agg}
				{/if}
			</option>
		{/each}
	</select>
</form>
