<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { EChartBuilder, ChartOptions } from '$lib/io/eChartBuilder';
	import { generateID } from '$lib/io/fileUtils';
	import { allCharts, newChartID } from '$lib/io/stores';

	const addEChartPropsToStore = () => {
		//var echart = new EChartBuilder(chart);
		//var eChartDataset = echart.getOptions();
		var id = generateID();
		$newChartID = id;
		var data = addMetadataToChart(id); //@ts-ignore
	};

	const addMetadataToChart = () => {
		var id = generateID();

		let chartMetaData = {
			filename: null,
			chartID: id,
			datasetID: null,
			chartType: null,
			colors: null,
			filters: [],
			groupbyColumns: [],
			aggregator: null,
			xColumn: null,
			yColumn: null,
			columns: [],
			chartOptions: null
		};
		$allCharts = [...$allCharts, chartMetaData];
	};

	const addBarPlot = () => addEChartPropsToStore(ChartOptions.bar);
	const addScatterPlot = () => addEChartPropsToStore(ChartOptions.scatter);
	const addPiePlot = () => addEChartPropsToStore(ChartOptions.pi);
	const addLinePlot = () => addEChartPropsToStore(ChartOptions.line);
	const addAreaPlot = () => addEChartPropsToStore(ChartOptions.area);
</script>

<Button color="alternative" pill={false} outline={false}>{chosenComponent}</Button>
