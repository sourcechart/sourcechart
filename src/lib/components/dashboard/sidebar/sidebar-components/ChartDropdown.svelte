<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	type SideBarVersion = 'WorkFlow' | 'LowCode';
	export let sideBarVersion: SideBarVersion;

	let chosenPlot: string = 'Chart Type';

	let rectangleCharts: any[] = [
		{
			chartType: 'Bar'
		},
		{
			chartType: 'Scatter'
		},
		{
			chartType: 'Pie'
		},
		{
			chartType: 'Line'
		},
		{
			chartType: 'Area'
		}
	];

	if (sideBarVersion === 'WorkFlow') {
		rectangleCharts = [...rectangleCharts, { chartType: 'density' }];
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
		plot = plot.toLowerCase();
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

<Button pill={false} outline color="light">Bar Chart (Default)</Button>
<Dropdown class="overflow-y-auto py-1">
	{#each rectangleCharts as { chartType }, i (i)}
		<DropdownItem on:click={() => chooseChart(chartType)}>{chartType}</DropdownItem>
	{/each}
</Dropdown>
