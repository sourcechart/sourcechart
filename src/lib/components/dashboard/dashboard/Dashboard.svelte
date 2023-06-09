<script>
	import MoveableChart from '$lib/components/dashboard/charts/MoveableChart.svelte';
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import ChartDrawer from '$lib/components/dashboard/drawer/ChartDrawer.svelte';
	import { allCharts, activeChart } from '$lib/io/stores';
	import { clickOutside, clickInside, } from '$lib/actions/clickUtils';
	
	function handleOutside() {
		$activeChart = false;
	}

	function handleInside() {
		$activeChart = true;
	}
</script>

<div use:clickOutside on:click_outside={handleOutside} use:clickInside on:click_inside={handleInside}>
	<div class="flex justify-center">
		<NavBar />
	</div>
	{#each $allCharts as item (item)}
		<MoveableChart id={item.chartID} chartOptions={item.chartOptions} />
	{/each}
	<ChartDrawer />
</div>
