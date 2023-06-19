<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { EChartBuilder, ChartOptions } from '$lib/io/eChartBuilder';
	import { generateID } from '$lib/io/fileUtils';
	import { allCharts, newChartID, mostRecentChartID } from '$lib/io/stores';

	let chosenPlot: string = 'Choose Plot';
	let rectangleCharts = [
		{
			icon: '',
			chartType: ChartOptions.bar
		},
		{
			icon: '',
			chartType: ChartOptions.scatter
		},
		{
			icon: '',
			chartType: ChartOptions.pie
		},
		{
			icon: '',
			chartType: ChartOptions.line
		},
		{
			icon: '',
			chartType: ChartOptions.area
		}
	];

	function chooseChart(plot: string) {
		chosenPlot = plot;
	}
</script>

<Button color="alternative" pill={false} outline={false}>{chosenPlot}</Button>
<Dropdown>
	{#each rectangleCharts as { icon, chartType } (icon)}
		<DropdownItem on:click={() => chooseChart(chartType)}>{chartType}</DropdownItem>
	{/each}
</Dropdown>
