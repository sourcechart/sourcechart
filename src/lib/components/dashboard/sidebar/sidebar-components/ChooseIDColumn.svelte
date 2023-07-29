<script lang="ts">
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	import { getColumnsFromFile, workflowIDColumn, HDBScanWorkflow } from '$lib/io/Stores';

	$: columns = getColumnsFromFile();
	$: workflow = HDBScanWorkflow();
	$: $workflow;

	let idColumn: string | null = 'ID Column';

	const chooseIDColumn = (column: string | null) => {
		idColumn = column;
		workflowIDColumn.set(column);
	};
</script>

<Button color="alternative" pill={false} outline={false}>{idColumn}</Button>
<Dropdown>
	{#each $columns as column}
		<DropdownItem on:click={() => chooseIDColumn(column)}>{column}</DropdownItem>
	{/each}
</Dropdown>
