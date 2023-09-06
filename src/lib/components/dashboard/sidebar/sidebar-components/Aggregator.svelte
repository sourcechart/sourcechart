<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';

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

<div class="space-y-1 space-x-1">
	{#each aggs as agg}
		<Button
			pill={false}
			outline
			color={agg === selectedAggregator ? 'primary' : 'light'}
			on:click={() => selectAggregator(agg)}
		>
			{agg}
		</Button>
	{/each}
</div>
