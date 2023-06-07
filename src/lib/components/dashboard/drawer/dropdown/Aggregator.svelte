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

	function setAggregator(event: Event) {
		let chart = $allCharts[$i];
		chart.aggregator = selected;
		$allCharts[$i] = chart;
	}
</script>

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
