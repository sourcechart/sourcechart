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
		{ componentType: 'file-upload', component: FileUploadButton },
		{ componentType: 'pie', component: PiePlotButton }
	];
</script>

<NavBarWrapper>
	{#each components as component (component)}
		<svelte:component this={component.component} />
	{/each}
</NavBarWrapper>
