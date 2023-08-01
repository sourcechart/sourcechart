/**  State Management for Echarts Stores **/
import { writable, derived } from 'svelte/store';

import { ChartDataWorkFlow } from './ChartDataWorkflows';
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

export const getChartOptions = (id: string | undefined) => {
	if (id) {
		//@ts-ignore
		return derived([allCharts], async ([$allCharts], set) => {
			if ($allCharts.length > 0) {
				const chart = $allCharts.find((item: { chartID: string }) => item.chartID === id);

				if (chart) {
					const db: DuckDBClient = chart.database;
					const newChart = new ChartDataWorkFlow(db, chart);
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

export const HDBScanWorkflow = () => {
	return derived(
		[allCharts, mostRecentChartID, workflowIDColumn], //@ts-ignore
		async ([$allCharts, $mostRecentChartID, $workflowIDColumn], set) => {
			if ($allCharts.length > 0) {
				const chart = $allCharts.find(
					(item: { chartID: string }) => item.chartID === $mostRecentChartID
				);

				const getCluster = () => {
					if (chart)
						return {
							chartID: $mostRecentChartID ? $mostRecentChartID : '',
							id: $workflowIDColumn ? $workflowIDColumn : '',
							attributes: chart.groupbyColumns,
							filename: chart.filename
						};
				};
			}
		}
	);
};
