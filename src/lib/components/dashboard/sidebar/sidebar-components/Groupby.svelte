<script lang="ts">
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex,
		groupbyColumns
	} from '$lib/io/Stores';

	let tags: Array<string> = [];

	export let ButtonName: string;

	$: columns = getColumnsFromFile();
	$: clickChart = clickedChart();
	$: i = clickedChartIndex();

	$: if ($allCharts.length > 0 && $allCharts[$i]?.groupbyColumns) {
		tags = $allCharts[$i].groupbyColumns;
	}

	$: if ($clearChartOptions && tags.length > 0 && $clickChart?.groupbyColumns) {
		tags = [];
		let chart: Chart = $allCharts[$i]; //We are be able to refactor this to a derived store.
		chart.groupbyColumns = []; //@ts-ignore
		$allCharts[$i] = chart;
	}

	const addColumnToGroupBy = (column: string | null) => {
		let chart = $allCharts[$i];
		if (column) {
			tags = [...tags, column]; //@ts-ignore
			chart.groupbyColumns = tags; //@ts-ignore
			$groupbyColumns = tags;
		}
		$allCharts[$i] = chart;
	};

	const getTagsOnClick = () => {
		tags = [];
		if ($clickChart?.groupbyColumns) {
			tags = $clickChart.groupbyColumns;
		}
		return tags;
	};
</script>

<Button color="alternative" pill={false} outline={false}>{ButtonName}</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => addColumnToGroupBy(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
