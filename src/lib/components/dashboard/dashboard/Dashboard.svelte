<!-- I only put this here so it would be easier to navigate to in the file tree. Could definitely be in /dashboard/+page.svelte-->
<script>
	import MoveableChart from '$lib/components/dashboard/charts/MoveableChart.svelte';
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import Draw from '$lib/components/ui/draw/Draw.svelte';
	import { allCharts } from '$lib/io/stores';
	import { DarkMode } from '$lib/components/ui';

	//import DarkMode from '$lib/components/ui/darkmode/DarkMode.svelte';
	//let dark = false;
</script>

<Draw />
<div class="absolute top-0 right-0 mt-4">
	<DarkMode />
</div>
<div class="relative">
	<div class="flex justify-center justify-items-center">
		<NavBar />
	</div>
	<div>
		{#each $allCharts as chart (chart)}
			<MoveableChart id={chart.chartID} chartOptions={chart.chartOptions} />
		{/each}
	</div>
	<div class="fixed top-1/2 left-0 transform -translate-y-1/2">
		<Sidebar />
	</div>
</div>
