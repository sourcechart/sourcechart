<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import {
		getColumnsFromFile,
		clearChartOptions,
		allCharts,
		clickedChart,
		clickedChartIndex,
		groupbyColumns
	} from '$lib/io/Stores';

	let filters = [];
	$: columns = getColumnsFromFile();
	$: clickChart = clickedChart();
	$: i = clickedChartIndex();

	const addColumnToFilter = (column: string | null) => {
		let chart = $allCharts[$i];
	};
</script>

<Button pill={false} outline color="light">
	<div class="flex justify-between space-x-2">
		<svg
			class="text-gray-700 dark:text-gray-400"
			x="0px"
			y="0px"
			width="18"
			height="18"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 18"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 1v16M1 9h16"
			/>
		</svg>
		<p class="text-gray-400">Add Filter</p>
	</div>
	<Dropdown class="overflow-y-auto h-48 py-1">
		{#each $columns as column}
			<DropdownItem on:click={() => addColumnToFilter(column)}>{column}</DropdownItem>
		{/each}
	</Dropdown>
</Button>
