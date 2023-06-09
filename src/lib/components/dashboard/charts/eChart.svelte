<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { activeChart, mostRecentChartID } from '$lib/io/stores';
	import { clickInside, clickOutside } from '$lib/actions/clickUtils';

	export let id: string;
	//@ts-ignore
	export let options;

	function handleInside(event: Event) {
		$mostRecentChartID = (event.target as HTMLElement).id;
		$activeChart = true;
	}

	function cOutside() {
		$activeChart = false;
	}
</script>

<div
	class="flex absolute container justify-center"
	use:clickInside
	on:click_inside={handleInside}
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
