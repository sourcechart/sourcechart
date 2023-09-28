<script lang="ts">
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import { allCharts, clickedChartIndex, responsiveType } from '$lib/io/Stores';

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

	let showTooltip: boolean = false;
	let hoverTimeout: NodeJS.Timeout;

	const startHover = (): void => {
		hoverTimeout = setTimeout(() => {
			showTooltip = true;
		}, 800);
	};

	const endHover = (): void => {
		clearTimeout(hoverTimeout);
		showTooltip = false;
	};
</script>

<div class="relative inline-flex">
	<button
		aria-label="Add Filter"
		on:click={addFilterToSidebar}
		on:mouseover={startHover}
		on:mouseout={endHover}
		on:focus={() => null}
		on:blur={() => null}
	>
		<PlusSolid />
	</button>

	<!-- Tooltip element -->
	{#if showTooltip && $responsiveType !== 'mobile'}
		<div
			role="tooltip"
			class="absolute -left-10 top-full mt-2 p-2 bg-neutral-200 text-gray-700 text-xs rounded-sm shadow-md"
		>
			Add Filter
		</div>
	{/if}
</div>
