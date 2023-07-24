/**  State Management for Echarts Stores **/
import { writable, derived } from 'svelte/store';
import { Query } from '$lib/io/QueryBuilder';
import type { DuckDBClient } from './DuckDBCLI';

export const globalMouseState = writable<boolean>(false);
export const isMouseDown = writable<boolean>(false);
export const navBarState = writable<NavBar>('select');
export const mouseEventState = writable<MouseEvents>();
export const mostRecentChartID = writable<string>();
export const chosenFile = writable<string | null>('');
export const newChartID = writable<string>();
export const activeSidebar = writable<boolean>();
export const clearChartOptions = writable<boolean>(false);
export const allCharts = writable<Chart[]>([]);
export const fileUploadStore = writable<fileUpload[]>([]);
export const timesVisitedDashboard = writable<number>(0);
export const groupbyColumns = writable<string[]>([]);
export const polygons = writable<Polygon[]>([]);
export const mouseType = writable<string | null>();
export const workflowIDColumn = writable<string | null>();

const createDropdownStore = () => {
	const { subscribe, set, update } = writable(null);

	return {
		subscribe,
		open: (id: any) => set(id),
		close: () => set(null),
		toggle: (id: any) => update((currentId) => (currentId !== id ? id : null))
	};
};

export const dropdownStore = createDropdownStore();

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
		};
	});

const getQueryObject = (chart: Chart): QueryObject => {
	return {
		chartID: chart?.chartID,
		queries: {
			select: {
				xColumn: { column: chart?.xColumn },
				yColumn: { column: chart?.yColumn, aggregator: chart?.aggregator },
				from: chart?.filename
			},
			groupbyColumns: [...(chart?.groupbyColumns ? chart.groupbyColumns : [])]
			/*on: { column1: null, column2: null, HOW: null }
				filters: [
					{ column: null, filter: null },
					{ column: null, filter: null }
				],
				having: [{ column: null, filter: null }],
			*/
		}
	};
};

const formatData = (res: any) => {
	const results = JSON.parse(
		JSON.stringify(
			res,
			(key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
		)
	);
	return results;
};

const getDataResults = async (db: DuckDBClient, query: string) => {
	var results = await db.query(query);
	return formatData(results);
};

const getColumn = (column: string | null) => {
	if (column) {
		return column.toString();
	} else {
		return '';
	}
};

export const getChartOptions = (id: string | undefined) => {
	if (id) {
		//@ts-ignore
		return derived([allCharts], async ([$allCharts], set) => {
			if ($allCharts.length > 0) {
				const chart = $allCharts.find((item: { chartID: string }) => item.chartID === id);

				const updateChart = (results: any[], chart: Chart) => {
					var xColumn = getColumn(chart.xColumn);
					var yColumn = getColumn(chart.yColumn);
					var x = results.map((item) => item[xColumn]);
					var y = results.map((item) => item[yColumn]);
					chart.chartOptions.xAxis.data = x;
					chart.chartOptions.series[0].data = y;
					return chart;
				};

				if (chart) {
					let queryObject = getQueryObject(chart);
					const query = new Query(queryObject);
					let queryString = query.build();
					if (chart.database && chart.xColumn && chart.yColumn) {
						const db: DuckDBClient = chart.database;
						let results = await getDataResults(db, queryString);
						let options = updateChart(results, chart);
						set(options); // Update the derived store with the updated chart options
					}
				}
			} else {
				set(undefined); // Update the derived store with undefined if there are no charts
			}
		});
	}
};
export const fileDropdown = () => {
	return derived(fileUploadStore, ($fileUploadStore) => {
		const files = $fileUploadStore.map((item: { filename: string }) => item.filename);
		return files;
	});
};

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

export const touchStates = () => {
	return derived(
		[navBarState, mouseEventState, mouseType],
		([$navBarState, $mouseEventState, $mouseType]) => {
			let touchState: MouseEvents;
			if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
				touchState = 'isDrawing';
			} else if ($navBarState === 'eraser' && $mouseEventState === 'isTouching') {
				touchState = 'isErasing';
			} else if (
				$navBarState === 'select' &&
				$mouseEventState === 'isTouching' &&
				$mouseType !== 'move' &&
				$mouseType !== ''
			) {
				touchState = 'isResizing';
			} else if (
				$navBarState === 'select' &&
				$mouseType === 'move' &&
				$mouseEventState === 'isTouching'
			) {
				touchState = 'isTranslating';
			} else if ($navBarState === 'select' && $mouseEventState === 'isHovering') {
				touchState = 'isHovering';
			} else if ($navBarState === 'select' && $mouseEventState === 'isTouching') {
				touchState = 'isTouching';
			} else {
				return 'default';
			}
			return touchState;
		}
	);
};

const getHDBSCANWorkFlow = (someObject: any) => {
	return {
		chartID: someObject.chartID,
		queries: {
			select: {
				clusterColumns: { column: someObject.clusterColumns },
				from: someObject.filename
			}
		}
	};
};

export const HDBScanWorkflow = () =>
	derived(
		[allCharts, mostRecentChartID, workflowIDColumn],
		async ([$allCharts, $mostRecentChartID, $workflowIDColumn]) => {
			if ($allCharts.length > 0) {
				const dataset = $allCharts.find(
					(item: { chartID: string }) => item.chartID === $mostRecentChartID
				);

				const getCluster = () => {
					return {
						chartID: $mostRecentChartID ? $mostRecentChartID : '',
						id: $workflowIDColumn ? $workflowIDColumn : '',
						attributes: dataset.groupbyColumns,
						filename: dataset.filename
						//filter: dataset.filter
					};
				};

				const checkNameForSpacesandHyphens = (column: string) => {
					if (!column.match('^[a-zA-Z0-9]+$')) {
						column = ['"', column, '"'].join('');
					}
					return column;
				};

				const constructQuery = (cluster: any) => {
					let columns = [...cluster.attributes];
					for (let i = 0; i < columns.length; i++) {
						columns[i] = checkNameForSpacesandHyphens(columns[i]);
					}
					let query = [
						'SELECT',
						columns.join(', '),
						'FROM',
						checkNameForSpacesandHyphens(cluster.filename)
					].join(' ');
					return query;
				};

				if (dataset) {
					let hdbscanQuery = getCluster();
					let queryString = constructQuery(hdbscanQuery);
					const db: DuckDBClient = dataset.database;
					let results = await getDataResults(db, queryString);
					let multidimensialArray = results.map((obj: any) => Object.values(obj));
					console.log(multidimensialArray);
				}
			}
		}
	);
