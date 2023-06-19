<script lang="ts">
	import { allCharts, clickedChartIndex, clickedChart, clearChartOptions } from '$lib/io/stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator = 'Aggregator';

	$: i = clickedChartIndex();
	$: clickChart = clickedChart();
	$: $clearChartOptions, (selectedAggregator = '');

	$: if ($clickChart?.aggregator) {
		selectedAggregator = $clickChart.aggregator;
	}

	function selectAggregator(agg: string) {
		selectedAggregator = agg;

		allCharts.update((charts) => {
			charts[$i].aggregator = selectedAggregator;
			return charts;
		});
	}
</script>

<Button color="alternative" pill={false} outline={false}>{selectedAggregator}</Button>
<Dropdown
	class="text-center font-medium inline-flex items-center justify-center text-sm text-black dark:bg-gray-800 dark:text-gray-600 hover:text-blue-700 focus:text-blue-700 dark:focus:text-gray-800"
>
	{#each aggs as agg}
		<DropdownItem on:click={() => selectAggregator(agg)}>{agg}</DropdownItem>
	{/each}
</Dropdown>
