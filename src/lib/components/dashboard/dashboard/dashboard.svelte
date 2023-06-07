<script>
	import MoveableChart from '$lib/components/dashboard/charts/MoveableChart.svelte';
	import { allCharts } from '$lib/io/stores';
	import ChartDrawer from '$lib/components/dashboard/drawer/ChartDrawer.svelte';
</script>

{#each $allCharts as item (item)}
	<MoveableChart id={item.chartID} chartOptions={item.chartOptions} />
{/each}
<ChartDrawer />
