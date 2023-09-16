/**  State Management for eCharts Stores **/
import { writable, derived } from 'svelte/store';
import { DataIO } from '$lib/io/DataIO';
import { storeToLocalStorage, storeFromLocalStorage } from '$lib/io/Storage';
import type { DuckDBClient } from './DuckDBClient';

export const globalMouseState = writable<boolean>(false);
export const isMouseDown = writable<boolean>(false);
export const navBarState = writable<NavBar>('select');
export const touchState = writable<TouchState>();
export const mostRecentChartID = writable<string>();
export const chosenFile = writable<string | null>('');
export const newChartID = writable<string>();
export const activeSidebar = writable<boolean>();
export const clearChartOptions = writable<boolean>(false);
export const allCharts = writable<Chart[]>(storeFromLocalStorage('allCharts', []));
export const fileUploadStore = writable<FileUpload[]>(storeFromLocalStorage('fileUploadStore', []));
export const timesVisitedDashboard = writable<number>(0);
export const groupbyColumns = writable<string[]>([]);
export const polygons = writable<Polygon[]>([]);
export const arrows = writable<Arrow[]>(storeFromLocalStorage('arrows', []));
export const mouseType = writable<string | null>();
export const workflowIDColumn = writable<string | null>();
export const epsilonDistance = writable<number>();
export const minimumPointsForCluster = writable<number>();
export const duckDBInstanceStore = writable<DuckDBClient>();
export const activeDropZone = writable<boolean>();
export const selectedColumnStore = writable<ColumnName[]>([]);
export const filters = writable<any[]>([]);

const createDropdownStore = () => {
	const { subscribe, set, update } = writable(null);

	return {
		subscribe,
		open: (id: any) => set(id),
		close: () => set(null),
		toggle: (id: any) => update((currentId) => (currentId !== id ? id : null))
	};
};

export const getFileFromStore = () =>
	derived([fileUploadStore, chosenFile], ([$fileUploadStore, $chosenFile]) => {
		const fObject = $fileUploadStore.find(
			(axis: { filename: string }) => axis.filename == $chosenFile
		);
		return fObject;
	});

export const getColumnsFromFile = () =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		const options = $allCharts.find(
			(item: { chartID: string }) => item.chartID === $mostRecentChartID
		);
		if (options?.columns) {
			return options.columns;
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
			filename: options?.filename,
			xColumn: options?.xColumn,
			yColumn: options?.yColumn,
			columns: options?.columns,
			groupbyColumns: options?.groupbyColumns,
			filterColumns: options?.filterColumns,
			aggregator: options?.aggregator
		};
	});

export const getChartOptions = (id: string | undefined) => {
	if (id) {
		return derived(
			[allCharts, epsilonDistance, minimumPointsForCluster, duckDBInstanceStore], //@ts-ignore
			async (
				[$allCharts, $epsilonDistance, $minimumPointsForCluster, $duckDBInstanceStore],
				set
			) => {
				if ($allCharts.length > 0) {
					const chart = $allCharts.find((item: { chartID: string }) => item.chartID === id);
					if (chart) {
						const db = $duckDBInstanceStore;
						const newChart = new DataIO(db, chart, $epsilonDistance, $minimumPointsForCluster);
						const chartOption = await newChart.updateChart();
						set(chartOption);
					}
				} else {
					set(undefined);
				}
			}
		);
	}
};

export const fileDropdown = () =>
	derived(fileUploadStore, ($fileUploadStore) => {
		const filenames = $fileUploadStore.map((chart) => chart.filename);
		const uniqueFilenames = [...new Set(filenames)];
		return uniqueFilenames;
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

export const canvasBehavior = () => {
	return derived(
		[navBarState, touchState, mouseType],
		([$navBarState, $touchState, $mouseType]) => {
			let touchState: TouchState;
			if ($navBarState === 'drawRectangle' && $touchState === 'isTouching') {
				touchState = 'isDrawing';
			} else if ($navBarState === 'eraser' && $touchState === 'isTouching') {
				touchState = 'isErasing';
			} else if (
				$navBarState === 'select' &&
				$touchState === 'isTouching' &&
				$mouseType !== 'move' &&
				$mouseType !== ''
			) {
				//This will have to be changed
				touchState = 'isResizing';
			} else if (
				$navBarState === 'select' &&
				$mouseType === 'move' &&
				$touchState === 'isTouching'
			) {
				touchState = 'isTranslating';
			} else if ($navBarState === 'select' && $touchState === 'isHovering') {
				touchState = 'isHovering';
			} else if ($navBarState === 'select' && $touchState === 'isTouching') {
				touchState = 'isTouching';
			} else if ($navBarState === 'drawArrow' && $touchState === 'isTouching') {
				touchState = 'isDrawingArrow';
			} else {
				return 'default';
			}
			return touchState;
		}
	);
};

export const columnLabel = (axis: string) =>
	derived([allCharts, mostRecentChartID], ([$allCharts, $mostRecentChartID]) => {
		const options = $allCharts.find(
			(item: { chartID: string }) => item.chartID === $mostRecentChartID
		);
		if (options) {
			let axisColumn;
			let columns = options.columns;
			if (axis === 'X') {
				axisColumn = options.xColumn;
			} else if (axis === 'Y') {
				axisColumn = options.yColumn;
			}
			if (columns && axisColumn) {
				if (columns.includes(axisColumn)) {
					return axisColumn;
				} else {
					return `${axis.toUpperCase()} Axis`;
				}
			} else {
				return `${axis.toUpperCase()} Axis`;
			}
		} else {
			return `${axis.toUpperCase()} Axis`;
		}
	});

storeToLocalStorage(fileUploadStore, 'fileUploadStore');
storeToLocalStorage(allCharts, 'allCharts');
storeToLocalStorage(arrows, 'arrows');

export const dropdownStore = createDropdownStore();
export const createFileStore = (filename: string, fileSize: number, dataID: string) => {
	var tableColumnsSize = {
		filename: filename,
		datasetID: dataID,
		size: fileSize,
		fileextension: filename.split('.').pop()
	};

	fileUploadStore.update((fileUploadStore) => [...fileUploadStore, tableColumnsSize]);
};
