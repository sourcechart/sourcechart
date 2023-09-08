<script lang="ts">
	//@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte';
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	//@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import FilterRange from './FilterRange.svelte';
	//@ts-ignore
	import CloseButton from 'flowbite-svelte/CloseButton.svelte';
	import {
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	$: columns = getColumnsFromFile();

	export let columnName: string = 'Select Field';
	export let items: any[] = [];

	const handleColumnName = (column: string) => {
		columnName = column;
	};
</script>

<div class="w-full h-14 p-4 flex justify-between items-center bg-gray-500">
	<Button>{columnName}</Button>
	<Dropdown>
		{#each $columns as column}
			<DropdownItem
				on:click={() => {
					columnName = column;
				}}>{column}</DropdownItem
			>
		{/each}
	</Dropdown>
	<CloseButton />

	<!-- 
	{#if number}
		<FilterRange min={0} max={10} />
	{:else if string}
		Equality Thing
	{:else}
		foo
	{/if}
	-->
</div>
