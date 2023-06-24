<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChartOptions } from '$lib/io/eChartBuilder';
	import { allCharts, mostRecentChartID } from '$lib/io/Stores';
	import {
		AreaPlotButton,
		BarPlotButton,
		LinePlotButton,
		ScatterPlotButton,
		PiePlotButton
	} from './chart-components';
	let chosenPlot: string = 'Choose Plot';
	let rectangleCharts = [
		{
			icon: '',
			chartType: ChartOptions.bar,
			component: BarPlotButton
		},
		{
			icon: '',
			chartType: ChartOptions.scatter,
			component: ScatterPlotButton
		},
		{
			icon: '',
			chartType: ChartOptions.pie,
			component: PiePlotButton
		},
		{
			icon: '',
			chartType: ChartOptions.line,
			component: LinePlotButton
		},
		{
			icon: '',
			chartType: ChartOptions.area,
			component: AreaPlotButton
		}
	];

	function chooseChart(plot: string) {
		chosenPlot = plot;

		mostRecentChartID.update((id) => {
			allCharts.update((charts) => {
				const index = charts.findIndex((chart) => chart.chartID === id);

				if (index !== -1) {
					charts[index].chartType = plot; // Assuming 'chartType' is a property of the charts in 'allCharts'
				}

				return charts;
			});

			return id; // Return current 'mostRecentChartID'
		});
	}
</script>

<Button color="alternative" pill={false} outline={false}>{chosenPlot}</Button>
<Dropdown>
	{#each rectangleCharts as { icon, chartType, component }, i (i)}
		<DropdownItem on:click={() => chooseChart(chartType)}>{chartType}</DropdownItem>
	{/each}
</Dropdown>
