<script lang="ts">
	import { addEChartPropsToStore } from './navbar-utils';
	import { ChartOptions } from '$lib/io/eChartBuilder';
</script>

<div
	on:click={() => addEChartPropsToStore(ChartOptions.scatter)}
	on:keydown={() => null}
	class="flex flex-col items-center justify-center cursor-pointer"
>
	<h1>Scatter Plot</h1>
	<svg
		class="w-6 h-6"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" /> <circle cx="7" cy="17" r="1" />
		<circle cx="12" cy="12" r="1" /> <circle cx="17" cy="7" r="1" /></svg
	>
</div>
