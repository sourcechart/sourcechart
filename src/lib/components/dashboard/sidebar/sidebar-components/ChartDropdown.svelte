<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChartOptions } from '$lib/io/ChartOptions';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	/*import {
		AreaPlotButton,
		BarPlotButton,
		LinePlotButton,
		ScatterPlotButton,
		PiePlotButton
	} from './chart-components';
	*/
	type SideBarVersion = 'WorkFlow' | 'LowCode';
	export let sideBarVersion: SideBarVersion;

	let chosenPlot: string = 'Chart Type';

	let rectangleCharts: any[] = [
		{
			//	icon: '',
			chartType: ChartOptions.bar
			//	component: BarPlotButton
		},
		{
			//	icon: '',
			chartType: ChartOptions.scatter
			//	component: ScatterPlotButton
		},
		{
			//	icon: '',
			chartType: ChartOptions.pie
			//	component: PiePlotButton
		},
		{
			//	icon: '',
			chartType: ChartOptions.line
			//		component: LinePlotButton
		},
		{
			//D	icon: '',
			chartType: ChartOptions.area
			//D	component: AreaPlotButton
		}
	];

	if (sideBarVersion === 'WorkFlow') {
		console.log('triggered');
		rectangleCharts = [...rectangleCharts, { chartType: ChartOptions.density }];
	}

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
			charts.forEach((chart) => {
				chart.chartType = plot;
				if (plot === 'area') {
					chart.chartOptions.series[0].type = 'line';
					chart.chartOptions.series[0].areaStyle = {};
				} else {
					chart.chartOptions.series[0].type = plot;
				}
			});

			return charts;
		});
	};
</script>

<Button color="alternative" pill={false} outline={false}>{chosenPlot}</Button>
<Dropdown>
	{#each rectangleCharts as { chartType }, i (i)}
		<DropdownItem on:click={() => chooseChart(chartType)}>{chartType}</DropdownItem>
	{/each}
</Dropdown>
