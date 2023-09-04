<script lang="ts">
	import { getColumnsFromFile, workflowIDColumn } from '$lib/io/Stores'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte'; //@ts-ignore

	$: columns = getColumnsFromFile();

	let idColumn: string | null = 'ID Column';

	const chooseIDColumn = (column: string | null) => {
		idColumn = column;
		workflowIDColumn.set(column);
	};
</script>

<Button pill={false} outline={false}>{idColumn}</Button>
<Dropdown class="overflow-y-auto py-1">
	{#each $columns as column}
		<DropdownItem on:click={() => chooseIDColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
