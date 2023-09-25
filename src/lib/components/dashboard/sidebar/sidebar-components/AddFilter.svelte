<script lang="ts">
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	$: i = clickedChartIndex(); //@ts-ignore

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

<!-- "Add Filter" Button -->
<button on:click={addFilterToSidebar}>
	<PlusSolid />
</button>

<!-- Display Each Filter Component Underneath the Add Filter Button -->
