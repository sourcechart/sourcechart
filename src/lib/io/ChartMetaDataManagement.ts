import { mostRecentChartID, allCharts } from '$lib/io/Stores';

const addChartMetaData = (id: string, shape: string, polygon: Polygon): void => {
	let chartMetaData: Chart = {
		chartID: id,
		chartShape: shape,
		filename: null,
		aggregator: null,
		datasetID: null,
		columns: [],
		workflow: 'basic',
		groupbyColumns: [],
		xColumn: null,
		polygon: polygon,
		yColumn: null,
		canvasHeight: 0,
		canvasWidth: 0,
		database: null,
		chartOptions: {
			xAxis: { data: [], type: 'category', axisLine: { show: false } },
			series: [{ data: [], type: '',  barWidth: '60%',
 		}],
			yAxis: {
				splitLine: {show:false},
				type: 'value'
			}
		}
	};

	allCharts.update((value) => [...value, chartMetaData]);
	mostRecentChartID.set(id);
};

export { addChartMetaData };
