<script lang="ts">
	import { getColumnsFromFile, clickedChartIndex, chartOptions, allCharts } from '$lib/io/Stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	export let axis = '';

	let selectedColumn: string | null = `${axis} Axis`;
	let tags: Array<string | null> = [];

	$: i = clickedChartIndex();
	$: drawerOptions = chartOptions();
	$: columns = getColumnsFromFile();

	$: if ($drawerOptions.xColumn && $drawerOptions.yColumn && tags.length == 0) {
		tags = getTagsOnClick();
	}

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		if (axis.toUpperCase() === 'X') {
			selectedColumn = $allCharts[$i]?.xColumn ? $allCharts[$i].xColumn : `${axis} Axis`;
			tags = $allCharts[$i]?.xColumn ? [$allCharts[$i].xColumn] : [];
		} else if (axis.toUpperCase() === 'Y') {
			selectedColumn = $allCharts[$i]?.yColumn ? $allCharts[$i].yColumn : `${axis} Axis`;
			tags = $allCharts[$i]?.yColumn ? [$allCharts[$i].yColumn] : [];
		}
	}

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

	const chooseColumn = (column: string | null) => {
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
	};
</script>

<Button pill={false} outline color="light">{selectedColumn}</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
