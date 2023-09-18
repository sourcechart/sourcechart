import { mostRecentChartID, allCharts } from '$lib/io/Stores';

const addChartMetaData = (id: string, shape: string, polygon: Polygon): void => {
	let chartMetaData: Chart = {
		chartID: id,
		title: '',
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
		yColumn: null,
		/*
		Maybe I should seperate this out to a different store.
		
		The end goal is not to query the database everytime I move the canvas.
		But... If I use a derived store, it would do that anyway. Maybe I need to do some composition instead.

		*/
		polygon: polygon,
		canvasHeight: 0,
		canvasWidth: 0,

		legendKey: null,
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
