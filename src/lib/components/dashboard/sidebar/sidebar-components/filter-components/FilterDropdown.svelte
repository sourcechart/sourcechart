<script lang="ts">
	//@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	export let addFilterDistance: number = 0;
	export let items: any[] = [];
	export let column: string;
	let placement: string = 'bottom';

	$: i = clickedChartIndex();

	function updateFilter(item: string) {
		const existingFilter = $allCharts[$i].filterColumns.find((filter) => filter.column === column);

		if (existingFilter) {
			$allCharts[$i].filterColumns.find((filter) => filter.column === column).value = {
				item: item
			};
		} else {
			$allCharts[$i].filterColumns = [
				...$allCharts[$i].filterColumns,
				{
					column: column,
					value: { item: item }
				}
			];
		}
	}
</script>

<Button>Choose Field</Button>
<Dropdown
	placement={addFilterDistance > 50 || addFilterDistance === 0
		? (placement = 'top')
		: (placement = 'bottom')}
>
	{#each items as item}
		<DropdownItem on:click={() => updateFilter(item)}>{item}</DropdownItem>
	{/each}
</Dropdown>
