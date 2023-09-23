<script lang="ts">
	import { allCharts, clickedChartIndex, clearChartOptions } from '$lib/io/Stores'; //@ts-ignore
	import Tags from '$lib/components/ui/tags/Tags.svelte';
	import { onDestroy } from 'svelte';

	let aggs = ['avg', 'max', 'min', 'sum', 'count'];
	let selectedAggregator: string | null = 'Aggregator';
	let tags: Array<string> = []; // For storing selected aggregator
	let isAggDropdownOpen: boolean = false; // To control the dropdown's visibility
	let dropdownContainer: HTMLElement;

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

	$: {
		if (isAggDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
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

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<!-- Dropdown Button for Aggregators -->

<div class="w-full p-4 rounded-sm relative bg-neutral-900">
	<button
		bind:this={dropdownContainer}
		class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
		on:click={toggleAggDropdown}
	>
		<span class="text-sm ml-2"> Select Aggregator </span>
	</button>

	{#if isAggDropdownOpen}
		<button
			class={`
            scrollBarDiv bg-neutral-900 absolute top-full w-full mt-2 border
            rounded shadow-lg transform transition-transform 
            origin-top overflow-y-auto overflow-x-hidden z-10 h-48
            ${isAggDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
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
		{#if selectedAggregator !== 'Aggregator'}
			<span class="text-sm"> Selected Aggregator </span>
			<Tags items={tags} removeItem={removeTag} />
		{/if}
	</div>
</div>

<!-- You can keep the provided styles as-is or modify them to match your overall theme -->

<style>
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}

	.selectFieldColor {
		background-color: #33333d;
	}
	.selectFieldColor {
		background-color: #33333d;
	}
</style>
