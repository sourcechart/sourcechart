<script lang="ts">
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex,
		groupbyColumns
	} from '$lib/io/stores';
	//@ts-expect-error
	import Tags from 'svelte-tags-input';
	let tags: Array<string> = [];

	$: columns = getColumnsFromFile();
	$: clickChart = clickedChart();
	$: i = clickedChartIndex();

	$: {
		if ($clickChart) {
			if (tags.length == 0 && $clickChart.groupbyColumns.length > 0) {
				tags = getTagsOnClick();
			}
		}
	}

	$: if ($clearChartOptions && tags.length > 0 && $clickChart?.groupbyColumns) {
		tags = [];
		let chart: Chart = $allCharts[$i]; //We are be able to refactor this to a derived store.
		chart.groupbyColumns = []; //@ts-ignore
		$allCharts[$i] = chart;
	}

	function chooseColumn(column: string | null) {
		let chart = $allCharts[$i];
		if (column) {
			tags = [...tags, column]; //@ts-ignore
			chart.groupbyColumns = tags; //@ts-ignore
			$groupbyColumns = tags;
		}
		$allCharts[$i] = chart;
	}

	function getTagsOnClick() {
		tags = [];
		if ($clickChart?.groupbyColumns) {
			tags = $clickChart.groupbyColumns;
		}
		return tags;
	}
</script>

<div class="flex">
	<Button color="alternative" pill={false} outline={false}>Group By Column</Button>
</div>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
<Tags {tags} maxTags={1} />
