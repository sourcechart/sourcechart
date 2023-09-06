<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { PlusSolid } from 'flowbite-svelte-icons';

	import Filter from './chart-components/Filter.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let max: number = 1;
	let min: number = 0;
	let filters: any[] = [];

	const addColumnToFilter = async (column: string) => {
		let chart = $allCharts[$i];
		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			var correctColumn = checkNameForSpacesAndHyphens(column);

			const randomValue = await $duckDBInstanceStore.query(
				`SELECT ${correctColumn} as column FROM ${filename} ORDER BY RANDOM() LIMIT 1`
			);

			var formatedData = formatData(randomValue);

			if (typeof formatedData === 'string') {
				const distinctValues = await $duckDBInstanceStore.query(
					`SELECT DISTINCT ${correctColumn} as distinctValues FROM ${filename}`
				);
				var distinctValuesObject = formatData(distinctValues);
				filters = [
					...filters,
					{
						component: Dropdown,
						props: {
							items: distinctValuesObject.map((value: any) => value.distinctValues)
						}
					}
				];
			} else if (typeof formatedData === 'number') {
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
				filters = [...filters, { component: Filter, props: { min: min, max: max } }];
			}
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

<Button pill={false} outline color="light">
	<div class="flex justify-between items-center w-full">
		<span>Add Filter</span>
		<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
	</div>
	<Dropdown class="overflow-y-auto h-48 py-1">
		{#each $columns as column}
			<DropdownItem on:click={() => addColumnToFilter(column)}>{column}</DropdownItem>
		{/each}
	</Dropdown>
</Button>
{#each filters as filter}
	<svelte:component this={filter.component} {...filter.props} />
{/each}
