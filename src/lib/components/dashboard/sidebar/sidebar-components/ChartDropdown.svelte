<script lang="ts">
	//@ts-ignore
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
		rectangleCharts = [...rectangleCharts, { chartType: 'Density' }];
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
		if (chosenPlot === plot) {
			chosenPlot = 'Bar Chart (Default)';
			allCharts.update((charts) => {
				charts.splice($i, 1);
				return charts;
			});
		} else {
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
		}
	};
</script>

<div class="space-y-1 space-x-1 flex flex-row overflow-x-auto">
	{#each rectangleCharts as { chartType }, i (i)}
		<button
			class="block w-full rounded-lg bg-gray-600 text-left px-2 py-1 dark:text-black hover:bg-gray-200"
			on:click={() => chooseChart(chartType)}
		>
			{chartType}
		</button>
	{/each}
</div>
