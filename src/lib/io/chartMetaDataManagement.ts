import { mostRecentChartID, allCharts } from '$lib/io/stores';

const addChartMetaData = (id: string, shape: string): void => {
	//	let id = generateID();

	let chartMetaData: Chart = {
		chartID: id,
		shape: shape,
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
