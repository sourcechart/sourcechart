<script>
	import MoveableChart from '$lib/components/dashboard/charts/MoveableChart.svelte';
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import { allCharts } from '$lib/io/stores';
</script>

<div class="flex justify-center justify-items-center">
	<NavBar />
</div>
<div>
	{#each $allCharts as item (item)}
		<MoveableChart id={item.chartID} chartOptions={item.chartOptions} />
	{/each}
</div>
<div class="fixed top-1/2 left-0 transform -translate-y-1/2">
	<Sidebar />
</div>
