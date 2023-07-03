import { mostRecentChartID, allCharts } from '$lib/io/Stores';

const addChartMetaData = (id: string, shape: string): void => {
	let chartMetaData: Chart = {
		chartID: id,
		chartShape: shape,
		filename: null,
		chartType: null,
		aggregator: null,
		datasetID: null,
		columns: [],
		groupbyColumns: [],
		xColumn: null,
		yColumn: null,
		xData: [],
		yData: [],
		database: null, // placeholder
		chartOptions: {
			xAxis: { data: [] },
			series: [{ data: [], type: '' }]
		}
	};

	allCharts.update((value) => [...value, chartMetaData]);
	mostRecentChartID.set(id);
};

export { addChartMetaData };
