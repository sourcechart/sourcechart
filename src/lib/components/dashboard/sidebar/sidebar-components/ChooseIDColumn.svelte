<script lang="ts">
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	import { getColumnsFromFile, workflowIDColumn } from '$lib/io/Stores';

	$: columns = getColumnsFromFile();

	let idColumn: string | null = 'ID Column';

	const chooseIDColumn = (column: string | null) => {
		idColumn = column;
		workflowIDColumn.set(column);
	};
</script>

<Button pill={false} outline={false}>{idColumn}</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseIDColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
