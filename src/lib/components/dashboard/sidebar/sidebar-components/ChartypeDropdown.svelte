<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import {
		AreaPlotButton,
		BarPlotButton,
		LinePlotButton,
		ScatterPlotButton,
		FileUploadButton,
		PiePlotButton
	} from './chart-components';

	let chosenComponent = 'Select Component';

	function chooseChart(componentType: string) {
		chosenComponent = componentType;
	}
	let components = [
		{ componentType: 'bar', component: BarPlotButton },
		{ componentType: 'line', component: LinePlotButton },
		{ componentType: 'area', component: AreaPlotButton },
		{ componentType: 'scatter', component: ScatterPlotButton },
		{ componentType: 'pie', component: PiePlotButton },
		{ componentType: 'file-upload', component: FileUploadButton }
	];
</script>

<Button color="alternative" pill={false} outline={false}>{chosenComponent}</Button>
<Dropdown>
	{#each components as component (component)}
		<DropdownItem on:click={() => chooseChart(component.componentType)}>
			<svelte:component this={component.component} /></DropdownItem
		>
	{/each}
</Dropdown>
