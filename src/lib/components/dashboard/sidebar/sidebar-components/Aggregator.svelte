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

<div class="flex flex-wrap mt-4 space-x-3 justify-around">
	{#each aggs as agg}
		<button
			class="inline-block w-auto rounded-md border hover:bg-[#9d99dc77] border-gray-400 text-center p-1 justify-center shadow-md {selectedAggregator ===
			agg
				? 'bg-[#9d99dc77]'
				: ''}"
			on:click={() => {
				selectAggregator(agg);
			}}
		>
			<span class="text-xs font-thin">
				{agg}
			</span>
		</button>
	{/each}
</div>
