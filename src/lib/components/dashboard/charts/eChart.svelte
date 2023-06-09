<script lang="ts">
	import { Chart } from 'svelte-echarts';
	import { activeChart, mostRecentChartID } from '$lib/io/stores';
	import { clickInside, clickOutside } from '$lib/actions/clickUtils';

	export let id: string;
	//@ts-ignore
	export let options;

	function handleInside(event: Event) {
		$mostRecentChartID = (event.target as HTMLElement).id;
		$activeChart = false;
	}

	function cOutside() {
		$activeChart = true;
	}
</script>

<div
	use:clickInside
	on:click_inside={handleInside}
	use:clickOutside
	on:click_outside={cOutside}
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
