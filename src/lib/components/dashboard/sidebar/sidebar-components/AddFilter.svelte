<script lang="ts">
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	$: i = clickedChartIndex();
	$: filterColumns = $allCharts[$i]?.filterColumns ? $allCharts[$i].filterColumns : [];

	let filterIDCounter = 0; // Add this line at the top

	const addFilterToSidebar = () => {
		filterIDCounter += 1;
		allCharts.update((charts) => {
			charts[$i].filterColumns = [
				...$allCharts[$i].filterColumns,
				{ column: null, value: null, id: filterIDCounter }
			];
			return charts;
		});
	};
</script>

{#each filterColumns as filterData}
	<div class="py-2 flex">
		<Filter {filterData} />
	</div>
{/each}
<button on:click={addFilterToSidebar}>
	<div
		class="flex w-full selectFieldColor items-center justify-between shadow-md text-left px-3 py-1 dark:text-black hover:bg-gray-200"
	>
		Add Filter
		<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
	</div>
</button>

<style>
	.selectFieldColor {
		background-color: #cd9f34;
	}
	.selectFieldColor:hover {
		background-color: #fccb59;
	}
</style>
