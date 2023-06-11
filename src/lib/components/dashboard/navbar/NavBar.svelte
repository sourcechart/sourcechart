<script lang="ts">
	import {
		AreaPlotButton,
		BarPlotButton,
		LinePlotButton,
		ScatterPlotButton,
		FileUploadButton,
		PiePlotButton
	} from './navbar-components';
	import NavBarWrapper from './NavBarWrapper.svelte';

	let components = [
		{ componentType: 'bar', component: BarPlotButton },
		{ componentType: 'line', component: LinePlotButton },
		{ componentType: 'area', component: AreaPlotButton },
		{ componentType: 'scatter', component: ScatterPlotButton },
		{ componentType: 'pie', component: PiePlotButton },
		{ componentType: 'file-upload', component: FileUploadButton }
	];
</script>

<NavBarWrapper>
	{#each components as component (component)}
		<div class="flex items-center justify-between mx-1">
			<!-- Adjust the space-x-{n} to your preference -->
			<svelte:component this={component.component} />
		</div>
	{/each}
</NavBarWrapper>
