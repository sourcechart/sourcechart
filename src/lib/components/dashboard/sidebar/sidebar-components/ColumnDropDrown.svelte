<script lang="ts">
	import {
		columnLabel,
		getColumnsFromFile,
		clickedChartIndex,
		chartOptions,
		allCharts
	} from '$lib/io/Stores'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte'; //@ts-ignore

	export let axis = '';
	let tags: Array<string | null> = [];

	$: i = clickedChartIndex();
	$: drawerOptions = chartOptions();
	$: columns = getColumnsFromFile();
	$: label = columnLabel(axis);

	$: if ($drawerOptions.xColumn && $drawerOptions.yColumn && tags.length == 0) {
		tags = getTagsOnClick();
	}

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		if (axis.toUpperCase() === 'X') {
			tags = $allCharts[$i]?.xColumn ? [$allCharts[$i].xColumn] : [];
		} else if (axis.toUpperCase() === 'Y') {
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

<Button pill={false} outline color="light">{$label}</Button>
<Dropdown class="overflow-y-auto py-1">
	{#each $columns as column}
		<DropdownItem on:click={() => chooseColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
