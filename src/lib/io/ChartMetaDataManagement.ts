import { mostRecentChartID, allCharts } from '$lib/io/Stores';

const addChartMetaData = (id: string, shape: string, polygon: Polygon): void => {
	let chartMetaData: Chart = {
		chartID: id,
		chartType: null,
		chartShape: shape,
		filename: null,
		aggregator: null,
		datasetID: null,
		columns: [],
		schema: [],
		workflow: 'basic',
		groupbyColumns: [],
		filterColumns: [],
		xColumn: null,
		polygon: polygon,
		yColumn: null,
		canvasHeight: 0,
		canvasWidth: 0,
		chartOptions: {
			xAxis: { data: [], type: 'category' },
			series: [{ data: [], type: '', barWidth: '60%' }],
			yAxis: {
				splitLine: { show: false },
				type: 'value'
			}
		}
	};

	allCharts.update((value) => [...value, chartMetaData]);
	mostRecentChartID.set(id);
};

export { addChartMetaData };
