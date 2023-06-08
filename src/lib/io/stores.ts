/**  State Management for Echarts Stores **/
import { writable, derived } from 'svelte/store';
import { Query } from '$lib/io/queryBuilder';

export const mostRecentChartID = writable('');
export const chosenFile = writable<string>('');
export const newChartID = writable<string>();
export const activeChart = writable<boolean>();
export const clearChartOptions = writable<boolean>(false);
export const allCharts = writable<Array<Chart>>([]);
export const fileUploadStore = writable<Array<fileUpload>>([]);
export const timesVisitedDashboard = writable<number>(0);
export const groupbyColumns = writable<Array<string>>([]);

export const getFileFromStore = () =>
	derived([fileUploadStore, chosenFile], ([$fileUploadStore, $chosenFile]) => {
		const fObject = $fileUploadStore.find(
			(axis: { filename: string }) => axis.filename == $chosenFile
		);
		return fObject;
	});

export const getColumnsFromFile = () =>
	derived([fileUploadStore, chosenFile], ([$fileUploadStore, $chosenFile]) => {
		const fileObject = $fileUploadStore.find(
			(item: { filename: string }) => item.filename === $chosenFile
		);
		if (fileObject?.columns) {
			return fileObject.columns;
		} else {
			return [];
		}
	});

export const chartOptions = () =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		const options = $allCharts.find(
			(item: { chartID: string }) => item.chartID === $mostRecentChartID
		);
		return {
			datasetID: options?.datasetID,
			database: options?.database,
			filename: options?.filename,
			xColumn: options?.xColumn,
			yColumn: options?.yColumn,
			groupbyColumns: options?.groupbyColumns,
			aggregator: options?.aggregator
			//filters: chartOptions?.filters;
			//colors: chartOptions?.colors
		};
	});

export const getQuery = () =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		if ($allCharts.length > 0) {
			const chart = $allCharts.find(
				(item: { chartID: string }) => item.chartID === $mostRecentChartID
			);

			const getQueryObject = (): QueryObject => {
				return {
					//@ts-ignore
					chartID: chart?.chartID,
					queries: {
						select: {
							//@ts-ignore
							xColumn: { column: chart.xColumn }, //@ts-ignore
							yColumn: { column: chart.yColumn, aggregator: chart.aggregator },
							//@ts-ignore
							from: chart.filename
						},
						//filters: [
						//	{ column: null, filter: null },
						//	{ column: null, filter: null }
						//],
						//having: [{ column: null, filter: null }],
						//@ts-ignore
						groupbyColumns: [...chart.groupbyColumns]
						//on: { column1: null, column2: null, HOW: null }
					}
				};
			};

			let queryObject = getQueryObject();
			const query = new Query(queryObject);
			return query.build();
		} else {
			return '';
		}
	});

export const fileDropdown = () =>
	derived(fileUploadStore, ($fileUploadStore) => {
		const files = $fileUploadStore.map((item: { filename: string }) => item.filename);
		return files;
	});

export const clickedChart = () =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		if ($allCharts.length > 0) {
			const dataset = $allCharts.find(
				(item: { chartID: string }) => item.chartID === $mostRecentChartID
			);
			return dataset;
		}
	});

export const clickedChartIndex = () =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		const i = $allCharts.findIndex(
			(item: { chartID: string }) => item.chartID === $mostRecentChartID
		);
		return i;
	});