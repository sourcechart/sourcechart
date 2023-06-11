<script lang="ts">
	import { addEChartPropsToStore } from './navbar-utils';
	import { ChartOptions } from '$lib/io/eChartBuilder';
</script>

<div
	class="relative flex items-center align-center justify-center flex-col"
	on:click={() => addEChartPropsToStore(ChartOptions.scatter)}
	on:keydown={() => null}
>
	<h1>Scatter Plot</h1>
	<svg
		class="h-8 w-8"
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
