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

	let components = [
		{ componentType: 'bar', component: BarPlotButton },
		{ componentType: 'line', component: LinePlotButton },
		{ componentType: 'area', component: AreaPlotButton },
		{ componentType: 'scatter', component: ScatterPlotButton },
		{ componentType: 'pie', component: PiePlotButton },
		{ componentType: 'file-upload', component: FileUploadButton }
	];
</script>

<Button color="alternative" pill={false} outline={false}>Select Component</Button>
<Dropdown>
	{#each components as component (component)}
		<DropdownItem>
			<svelte:component this={component.component} /></DropdownItem
		>
	{/each}
</Dropdown>
