<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores'; //@ts-ignore
	import Tags from '$lib/components/ui/tags/Tags.svelte';

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator: string | null = 'Aggregator';
	let tags: Array<string> = []; // For storing selected aggregator
	let isAggDropdownOpen: boolean = false; // To control the dropdown's visibility

	$: i = clickedChartIndex();
	$: $clearChartOptions, (selectedAggregator = '');

	$: {
		if ($allCharts.length > 0 && $allCharts[$i]) {
			selectedAggregator = $allCharts[$i]?.aggregator ? $allCharts[$i].aggregator : 'Aggregator';
		}
		if (selectedAggregator !== 'Aggregator' && selectedAggregator) {
			tags = [selectedAggregator];
		} else {
			tags = [];
		}
	}

	const selectAggregator = (agg: string) => {
		// Toggle the selected aggregator
		if (selectedAggregator === agg) {
			selectedAggregator = 'Aggregator';
			tags = [];
		} else {
			selectedAggregator = agg;
			tags = [agg];
		}

		allCharts.update((charts) => {
			charts[$i].aggregator = selectedAggregator === 'Aggregator' ? null : selectedAggregator;
			return charts;
		});
	};

	const removeTag = () => {
		selectedAggregator = 'Aggregator';
		tags = [];
		allCharts.update((charts) => {
			charts[$i].aggregator = null;
			return charts;
		});
	};

	const toggleAggDropdown = () => {
		isAggDropdownOpen = !isAggDropdownOpen;
	};

	const closeAggDropdown = () => {
		isAggDropdownOpen = false;
	};
</script>

<!-- Dropdown Button for Aggregators -->

<div class="w-full p-4 rounded-sm relative selectFieldColor">
	<button
		class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
		on:click={toggleAggDropdown}
	>
		<span class="text-sm ml-2"> Select Aggregator </span>
	</button>

	{#if isAggDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 h-48"
			on:click|stopPropagation={closeAggDropdown}
		>
			{#each aggs as agg}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => {
						selectAggregator(agg);
					}}
				>
					{agg}
				</button>
			{/each}
		</button>
	{/if}
	<div class="mt-4 flex-grow">
		<span class="text-sm"> Selected Aggregator </span>
		<Tags items={tags} removeItem={removeTag} />
	</div>
</div>

<!-- You can keep the provided styles as-is or modify them to match your overall theme -->

<style>
	.selectFieldColor {
		background-color: #33333d;
	}
</style>
