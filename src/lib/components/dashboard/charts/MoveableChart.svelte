<script lang="ts">
	import Moveable from 'svelte-moveable';
	import EChart from './eChart.svelte';
	import { clickEscapeKey } from '$lib/actions/KeyboardActions';
	import { mostRecentChartID, allCharts, activeSidebar, clearChartOptions } from '$lib/io/Stores';

	export let chartOptions: object;
	export let id: string;

	let moveable;
	const keepRatio = true;
	const throttleScale = 0;
	const renderDirections = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

	function removeChart() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	}

	function handleInside(event: Event) {
		$mostRecentChartID = (event.target as HTMLElement).id;
		$activeChart = true;
	}
</script>

<div class="container" bind:this={moveable} use:clickEscapeKey on:escapeKeyPress={removeChart}>
	<EChart {id} options={chartOptions} />
</div>
<Moveable
	className="moveable"
	target={moveable}
	hideOrigin={true}
	hideDefaultLines={true}
	draggable={true}
	scalable={true}
	{keepRatio}
	{throttleScale}
	{renderDirections}
	on:drag={({ detail: e }) => {
		e.target.style.transform = e.transform;
	}}
	on:scale={({ detail: e }) => {
		e.target.style.transform = e.drag.transform;
	}}
/>

<style>
	.container {
		width: 400px;
		height: 400px;
	}
</style>
