<script lang="ts">
	import {
		getColumnsFromFile,
		clickedChartIndex,
		chartOptions,
		allCharts,
		getChartOptions
	} from '$lib/io/Stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';

	export let axis = '';

	let selectedColumn: string | null = `Choose ${axis} Axis`;

	let tags: Array<string | null> = [];

	$: i = clickedChartIndex();
	$: drawerOptions = chartOptions();

	$: if ($drawerOptions.xColumn && $drawerOptions.yColumn && tags.length == 0) {
		tags = getTagsOnClick();
	}

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		if (axis.toUpperCase() === 'X') {
			selectedColumn = $allCharts[$i]?.xColumn ? $allCharts[$i].xColumn : `Choose ${axis} Axis`;
			tags = $allCharts[$i]?.xColumn ? [$allCharts[$i].xColumn] : [];
		} else if (axis.toUpperCase() === 'Y') {
			selectedColumn = $allCharts[$i]?.yColumn ? $allCharts[$i].yColumn : `Choose ${axis} Axis`;
			tags = $allCharts[$i]?.yColumn ? [$allCharts[$i].yColumn] : [];
		}
	}

	$: columns = getColumnsFromFile();

	const getTagsOnClick = () => {
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
	};

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
