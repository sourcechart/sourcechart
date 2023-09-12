<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores'; //@ts-ignore

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator: string | null = 'Aggregator';

	$: i = clickedChartIndex();
	$: $clearChartOptions, (selectedAggregator = '');

	$: {
		if ($allCharts.length > 0 && $allCharts[$i]) {
			selectedAggregator = $allCharts[$i]?.aggregator ? $allCharts[$i].aggregator : 'Aggregator';
		}
	}

	const selectAggregator = (agg: string) => {
		// Toggle the selected aggregator
		if (selectedAggregator === agg) {
			selectedAggregator = 'Aggregator';
		} else {
			selectedAggregator = agg;
		}

		allCharts.update((charts) => {
			charts[$i].aggregator = selectedAggregator === 'Aggregator' ? null : selectedAggregator;
			return charts;
		});
	};
</script>

<div class="space-y-1 space-x-1 flex flex-row overflow-x-auto">
	{#each aggs as agg}
		<button
			class={`block px-4 py-2 rounded-lg text-white ${
				selectedAggregator === agg ? 'bg-blue-500' : 'bg-gray-700'
			} hover:bg-gray-600 transition duration-150 ease-in-out`}
			on:click={() => selectAggregator(agg)}
		>
			{agg}
		</button>
	{/each}
</div>
