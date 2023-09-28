<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores';
	import { onDestroy } from 'svelte';

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator: string | null = 'Aggregator';
	let isAggDropdownOpen: boolean = false;
	let dropdownContainer: HTMLElement;

	$: i = clickedChartIndex();
	$: $clearChartOptions, (selectedAggregator = '');

	$: {
		if (isAggDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	$: if ($allCharts.length > 0 && $allCharts[$i]?.aggregator) {
		selectedAggregator = $allCharts[$i].aggregator;
	} else {
		selectedAggregator = 'Aggregator';
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isAggDropdownOpen = false;
		}
	};

	const selectAggregator = (agg: string) => {
		// Toggle the selected aggregator
		if (selectedAggregator === agg) {
			selectedAggregator = 'Aggregator';
		} else {
			selectedAggregator = agg;
		}

		allCharts.update((charts) => {
			charts[$i].aggregator = selectedAggregator === 'Aggregator' ? null : selectedAggregator;
			return charts;
		});
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div
	class="scrollBarDiv bg-[#1c1c1ccd] flex justify-evenly items-center rounded-md overflow-x-auto py-2.5 border border-1 border-neutral-700/50"
>
	{#each aggs as agg}
		<button
			class="flex items-center justify-center w-auto truncate p-2 rounded-md hover:bg-[#9d99dc77] text-center shadow-md {selectedAggregator ===
			agg
				? 'bg-[#908bd971]'
				: 'bg-neutral-600/90'}"
			on:click={() => {
				selectAggregator(agg);
			}}
		>
			<span class="text-xs font-light">
				{agg}
			</span>
		</button>
	{/each}
</div>
