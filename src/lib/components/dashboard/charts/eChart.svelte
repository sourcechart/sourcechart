<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { activeChart, mostRecentChartID } from '$lib/io/stores';
	import { clickInside } from '$lib/actions/clickUtils';

	export let id: string;
	//@ts-ignore
	export let options;

	function handleInside(event: Event) {
		//@ts-ignore
		$mostRecentChartID = event.target.id;
		$activeChart = false;
	}
</script>

<div
	use:clickInside
	on:click_inside={handleInside}
	class="flex absolute container justify-center"
	{id}
>
	<Chart {options} />
</div>

<style>
	.container {
		width: 400px;
		height: 400px;
	}
</style>
