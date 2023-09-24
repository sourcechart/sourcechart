<script lang="ts">
	import Filter from './filter-components/Filter.svelte';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	$: i = clickedChartIndex(); //@ts-ignore
	$: filterColumns = $allCharts[$i]?.filterColumns ? $allCharts[$i].filterColumns : [];

	let filterIDCounter = 0; // Add this line at the top

	const addFilterToSidebar = () => {
		filterIDCounter += 1;
		allCharts.update((charts) => {
			//@ts-ignore
			charts[$i].filterColumns = [
				//@ts-ignore
				...$allCharts[$i].filterColumns, //@ts-ignore
				{ column: null, value: null, id: filterIDCounter }
			];
			return charts;
		});
	};
</script>

<button on:click={addFilterToSidebar}>
	<div class="flex w-full justify-between shadow-md text-left dark:text-black">
		<PlusSolid />
	</div>
</button>
{#each filterColumns as filterData}
	<div class="py-2 flex">
		<Filter {filterData} />
	</div>
{/each}
