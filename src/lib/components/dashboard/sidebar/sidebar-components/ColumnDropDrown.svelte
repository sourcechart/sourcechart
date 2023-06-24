<script lang="ts">
	import type { DuckDBClient } from '$lib/io/DuckDBCLI';
	import {
		getQuery,
		getColumnsFromFile,
		activeSidebar,
		clickedChartIndex,
		chartOptions,
		allCharts
	} from '$lib/io/Stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	export let axis = '';

	let selectedColumn = `Choose ${axis} Axis`;

	let tags: Array<string> = [];
	let chartObject: Chart;
	let x: any;
	let y: any;

	$: i = clickedChartIndex();
	$: query = getQuery();
	$: drawerOptions = chartOptions();
	$: chartObject = $allCharts[$i];

	$: {
		if ($drawerOptions.xColumn && $drawerOptions.yColumn && tags.length == 0) {
			tags = getTagsOnClick();
		}
	}

	$: columns = getColumnsFromFile();
	$: $activeSidebar, getAxisData();

	function getTagsOnClick() {
		tags = [];
		if (axis.toUpperCase() === 'X') {
			if ($drawerOptions?.xColumn) {
				tags = [$drawerOptions?.xColumn];
			} else {
				tags = [];
			}
		}
		if (axis.toUpperCase() === 'Y') {
			if ($drawerOptions?.yColumn) {
				tags = [$drawerOptions?.yColumn];
			} else {
				tags = [];
			}
		}
		return tags;
	}

	function clearData() {
		allCharts.update((charts) => {
			let chart: Chart = charts[$i];
			chart.aggregator = null;
			chart.xColumn = null;
			chart.yColumn = null;
			chart.filename = null;
			chart.groupbyColumns = [];
			chart.chartOptions.xAxis = { data: [] }; //@ts-ignore
			chart.chartOptions.series[0] = { data: [], type: chart.chartType };
			chart.database = null;

			if (axis === 'x') {
				tags = [];
			} else if (axis === 'y') {
				tags = [];
			} else {
				tags = [];
			}

			return charts;
		});
	}

	function getDataResults(res: object) {
		const results = JSON.parse(
			JSON.stringify(res, (key, value) => (typeof value === 'bigint' ? value.toString() : value))
		);
		return results;
	}

	async function getAxisData() {
		if ($drawerOptions.xColumn && $drawerOptions.yColumn && $drawerOptions.database) {
			const db: DuckDBClient = $drawerOptions.database;
			var q = $query.toString();
			let results = await db.query(q);
			let data = getDataResults(results);
			updateChart(data);
		}
		return;
	}

	function updateChart(data: Array<any>) {
		let xColumn = getColumn(chartObject.xColumn);
		let yColumn = getColumn(chartObject.yColumn);
		x = data.map((item) => item[xColumn]);
		y = data.map((item) => item[yColumn]);

		allCharts.update((charts) => {
			charts[$i].chartOptions.xAxis.data = x;
			charts[$i].chartOptions.series[0].data = y;
			return charts;
		});
	}

	function getColumn(column: string | null) {
		if (column) {
			return column.toString();
		} else {
			return '';
		}
	}

	function chooseColumn(column: string | null) {
		if (column) {
			selectedColumn = column;

			allCharts.update((charts) => {
				if (axis.toUpperCase() === 'X') {
					charts[$i].xColumn = column;
					tags = [column];
				}
				if (axis.toUpperCase() === 'Y') {
					charts[$i].yColumn = column;
					tags = [column];
				}
				return charts;
			});
		} else {
			tags = [];
		}
	}
</script>

<Button color="alternative" pill={false} outline={false}>{selectedColumn}</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
