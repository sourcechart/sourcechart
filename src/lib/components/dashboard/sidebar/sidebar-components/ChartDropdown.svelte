<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	type SideBarVersion = 'WorkFlow' | 'LowCode';
	export let sideBarVersion: SideBarVersion;

	let chosenPlot: string = 'Bar Chart (Default)';

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
	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	$: i = clickedChartIndex();

	$: {
		if ($allCharts[$i]?.chartOptions?.series[0]?.type) {
			chosenPlot = capitalizeFirstLetter($allCharts[$i].chartOptions.series[0].type);
		} else {
			chosenPlot = 'Bar Chart (Default)';
		}
	}
	const chooseChart = (plot: string) => {
		chosenPlot = plot;
		plot = plot.toLowerCase();
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

<div class="space-y-1 space-x-1">
	{#each rectangleCharts as { chartType }, i (i)}
		<Button pill={false} outline color="light" on:click={() => chooseChart(chartType)}
			>{chartType}</Button
		>
	{/each}
</div>
