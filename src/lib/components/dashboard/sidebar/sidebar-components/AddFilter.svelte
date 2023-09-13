<script lang="ts">
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { clickedChart } from '$lib/io/Stores';

	$: chart = clickedChart();
	$: filterColumns = $chart?.filterColumns ? $chart.filterColumns : [];
	let components: { component: any }[] = []; // Modify this line

	const addFilterToSidebar = () => {
		components = [{ component: Filter }, ...components];
	};
</script>

{#each filterColumns as filterData}
	<div class="py-2 flex">
		<svelte:component this={Filter} {filterData} />
	</div>
{/each}
<button on:click={addFilterToSidebar} on:keydown={null}>
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
</style>
