<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores';
	import CarrotDown from '$lib/components/ui/icons/CarrotDown.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	import { onDestroy } from 'svelte';

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator: string | null = 'Select Aggregator';
	let isAggDropdownOpen: boolean = false;
	let dropdownContainer: HTMLElement;

	$: i = clickedChartIndex();

	$: if ($allCharts.length > 0 && $allCharts[$i]?.aggregator) {
		selectedAggregator = $allCharts[$i].aggregator;
	} else {
		selectedAggregator = 'Select Aggregator';
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isAggDropdownOpen = false;
		}
	};

	const selectAggregator = (agg: string) => {
		selectedAggregator = agg;
		allCharts.update((charts) => {
			charts[$i].aggregator = selectedAggregator === 'Aggregator' ? null : selectedAggregator;
			return charts;
		});
		isAggDropdownOpen = false;
	};

	const clearAggregator = () => {
		selectedAggregator = 'Select Aggregator';
		allCharts.update((charts) => {
			charts[$i].aggregator = null;
			return charts;
		});
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div class="relative mt-3">
	<div class="flex items-center justify-between">
		<span class="text-sm text-neutral-300">Aggregate</span>
		<button
			class="flex w-full items-center justify-between ml-3 bg-neutral-900/80 hover:bg-neutral-900/50 rounded-sm border border-1 border-neutral-700/50"
			on:click={(event) => {
				isAggDropdownOpen = !isAggDropdownOpen;
				event.stopPropagation();
			}}
		>
			<span class="text-sm text-neutral-300 ml-2">{selectedAggregator}</span>
			<CarrotDown class="hover:text-neutral-300" />
		</button>

		<button on:click={clearAggregator}>
			<CloseSolid class="ml-2 h-4 w-4 hover:text-neutral-300" />
		</button>
		{#if isAggDropdownOpen}
			<div
				bind:this={dropdownContainer}
				class="scrollBarDiv absolute top-full left-20 rounded-sm bg-neutral-900 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each aggs as agg}
					<button
						class="block w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300 truncate"
						on:click={() => {
							selectAggregator(agg);
						}}
						><div />
						{agg}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
