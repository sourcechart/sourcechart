<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChartOptions } from '$lib/io/eChartBuilder';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';
	import {
		AreaPlotButton,
		BarPlotButton,
		LinePlotButton,
		ScatterPlotButton,
		PiePlotButton
	} from './chart-components';

	let chosenPlot: string = 'Chart Type';

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

	$: i = clickedChartIndex();

	$: {
		if ($allCharts[$i]?.chartOptions?.series[0]?.type) {
			chosenPlot = $allCharts[$i].chartOptions.series[0].type;
		} else {
			chosenPlot = 'Choose Chart Type';
		}
	}
	const chooseChart = (plot: string) => {
		chosenPlot = plot;
		allCharts.update((charts) => {
			charts[$i].chartOptions.series[0].type = plot;
			return charts;
		});
	};
</script>

<Button color="alternative" pill={false} outline={false}>{chosenPlot}</Button>
<Dropdown>
	{#each rectangleCharts as { icon, chartType, component }, i (i)}
		<DropdownItem on:click={() => chooseChart(chartType)}>{chartType}</DropdownItem>
	{/each}
</Dropdown>
