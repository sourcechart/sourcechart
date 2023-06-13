<script lang="ts">
	import type { DuckDBClient } from '$lib/io/duckdbcli';
	import {
		getQuery,
		getColumnsFromFile,
		activeChart,
		clickedChartIndex,
		chartOptions,
		allCharts,
		clearChartOptions
	} from '$lib/io/stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	//@ts-expect-error
	import Tags from 'svelte-tags-input';

	export let axis = '';

	let tags: Array<string> = [];
	let chartObject: Chart;
	let x;
	let y;

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
	$: $activeChart, getAxisData();

	$: if (
		$clearChartOptions &&
		(($drawerOptions.xColumn && $drawerOptions.yColumn) ||
			$drawerOptions.xColumn ||
			$drawerOptions.yColumn)
	) {
		tags = clearData();
	}

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
		//change this to a derived store
		let chart: Chart = $allCharts[$i];
		chart.aggregator = null;
		chart.xColumn = null;
		chart.yColumn = null;
		chart.filename = null;
		chart.groupbyColumns = []; //@ts-ignore
		chart.chartOptions.xAxis = { data: [] }; //@ts-ignore
		chart.chartOptions.series[0] = { data: [], type: chart.chartType }; //@ts-ignore
		chart.database = null; //@ts-ignore
		//$allCharts[i] = chart;
		if (axis === 'x') {
			return [];
		} else if (axis === 'y') {
			return [];
		} else {
			return [];
		}
	}

	function getDataResults(res: object) {
		const results = JSON.parse(
			JSON.stringify(
				res, //.toArray(),
				(key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
			)
		);
		return results;
	}

	async function getAxisData() {
		//Get the Axis data after the you choose columns
		//@ts-ignore
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
		//Should this be a derived query?
		//Update chart object with columns dataset id.
		let xColumn = getColumn(chartObject.xColumn);
		let yColumn = getColumn(chartObject.yColumn);
		x = data.map((item) => item[xColumn]);
		y = data.map((item) => item[yColumn]);
		$allCharts[$i].chartOptions.xAxis.data = x;
		$allCharts[$i].chartOptions.series[0].data = y;
	}

	function getColumn(column: string | null) {
		if (column) {
			return column.toString();
		} else {
			return '';
		}
	}
	function chooseColumn(column: string | null) {
		//Add Tags to the Chosen Column Store.
		if (column) {
			if (axis.toUpperCase() === 'X') {
				chartObject.xColumn = column;
				tags = [column];
			}
			if (axis.toUpperCase() === 'Y') {
				chartObject.yColumn = column;
				tags = [column];
			}
			$allCharts[$i] = chartObject;
		} else {
			tags = [];
		}
	}
</script>

<!-- <div class="flex">
	<Button color="alternative" pill={false} outline={false}>Choose {axis} Axis</Button>
</div>
-->
<Button color="alternative" pill={false} outline={false}>Choose {axis} Axis</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
