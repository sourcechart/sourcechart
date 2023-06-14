<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { clickInside } from '$lib/actions/clickUtils';
	import { mostRecentChartID, activeChart } from '$lib/io/stores';

	export let id: string;
	export let options: any;

	function handleInside(event: Event) {
		$mostRecentChartID = (event.target as HTMLElement).id;
		$activeChart = true;
	}
</script>

<div
	class="flex absolute container justify-center"
	{id}
	use:clickInside
	on:click_inside={handleInside}
>
	<Chart {options} />
</div>

<style>
	.container {
		width: 400px;
		height: 400px;
	}
</style>
