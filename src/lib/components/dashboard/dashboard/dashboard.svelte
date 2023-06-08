<script>
	import MoveableChart from '$lib/components/dashboard/charts/MoveableChart.svelte';
	import { allCharts } from '$lib/io/stores';
	import SideBar from '$lib/components/dashboard/drawer/components/SideBar.svelte';

	import ChartDrawer from '$lib/components/dashboard/drawer/ChartDrawer.svelte';
</script>

{#each $allCharts as item (item)}
	<MoveableChart id={item.chartID} chartOptions={item.chartOptions} />
{/each}
<SideBar />