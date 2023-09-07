<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import FilterRange from './filter-components/FilterRange.svelte';
	import FilterDropdown from './filter-components/FilterDropdown.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { ChevronDownSolid, ChevronUpSolid } from 'flowbite-svelte-icons'; //@ts-ignore
	import { slide } from 'svelte/transition';

	let showFilter = false;
	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let max: number = 1;
	let min: number = 0;
	let filters: { [key: string]: { component: any; props: any } } = {};
	let selectedColumns: string[] = [];

	const addColumnToFilter = (column: string) => {
		if (selectedColumns.includes(column)) {
			selectedColumns = selectedColumns.filter((item) => item !== column);
		} else {
			selectedColumns = [...selectedColumns, column];
		}
		handleAsyncOperations(column);
	};

	const handleAsyncOperations = async (column: string) => {
		let chart = $allCharts[$i];
		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			var correctColumn = checkNameForSpacesAndHyphens(column);
			const randomValue = await $duckDBInstanceStore.query(
				`SELECT ${correctColumn} as column FROM ${filename} ORDER BY RANDOM() LIMIT 1`
			);
			var formattedData = formatData(randomValue);
			addComponentToFilter(formattedData, correctColumn, filename);
		}
	};

	const addComponentToFilter = async (
		formattedData: any,
		correctColumn: string,
		filename: string
	) => {
		var dataValue = formattedData[0].column;
		console.log(dataValue);
		if (typeof dataValue === 'string') {
			const distinctValues = await $duckDBInstanceStore.query(
				`SELECT DISTINCT ${correctColumn} as distinctValues FROM ${filename}`
			);
			var distinctValuesObject = formatData(distinctValues).map(
				(value: any) => value.distinctValues
			);
			filters[correctColumn] = {
				component: FilterDropdown,
				props: {
					items: distinctValuesObject
				}
			};
		} else if (typeof dataValue === 'number') {
			const maxResp = await $duckDBInstanceStore.query(
				`SELECT max(${correctColumn}) as maxValue FROM ${filename}`
			);
			const minResp = await $duckDBInstanceStore.query(
				`SELECT min(${correctColumn}) as minValue FROM ${filename}`
			);

			var maxObject = formatData(maxResp);
			var minObject = formatData(minResp);
			max = maxObject[0].maxValue;
			min = minObject[0].minValue;
			filters[correctColumn] = {
				component: FilterRange,
				props: { min: min, max: max }
			};
		}
	};

	function formatData(res: any) {
		const results = JSON.parse(
			JSON.stringify(
				res,
				(_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
			)
		);
		return results;
	}
</script>

<Button
	pill={false}
	outline
	color="light"
	on:click={() => {
		showFilter = !showFilter;
	}}
>
	<div class="flex justify-between items-center w-full">
		<span>Add Filter</span>
		{#if showFilter}
			<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
		{:else}
			<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
		{/if}
	</div>
</Button>
<Dropdown class="overflow-visible">
	{#each $columns as column}
		<DropdownItem
			pill={false}
			outline
			color={selectedColumns.includes(column) ? 'primary' : 'light'}
			on:click={() => addColumnToFilter(column)}
		>
			{column}
		</DropdownItem>
	{/each}
</Dropdown>
{#each selectedColumns as col (col)}
	{#if filters[col]}
		<svelte:component this={filters[col].component} {...filters[col].props} />
	{/if}
{/each}
