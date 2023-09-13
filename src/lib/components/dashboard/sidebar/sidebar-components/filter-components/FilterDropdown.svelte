<script lang="ts">
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';
	import Tags from '$lib/components/ui/tags/Tags.svelte';

	export let items: any[] = [];
	export let column: string;

	let filterValues: string[] = [];
	let isDropdownOpen: boolean = false;

	$: i = clickedChartIndex();

	function updateFilter(item: string) {
		const existingFilter = $allCharts[$i].filterColumns.find((filter) => filter.column === column);

		if (existingFilter) {
			$allCharts[$i].filterColumns.find((filter) => filter.column === column).value.item;
		}

		if (!filterValues.includes(item)) {
			filterValues = [...filterValues, item];
		}
	}

	function removeSelectedTag(item: string) {
		filterValues = filterValues.filter((val) => val !== item);
		const filterIndex = $allCharts[$i].filterColumns.findIndex(
			(filter) => filter.column === column && filter.value.item === item
		);
		if (filterIndex > -1) {
			$allCharts[$i].filterColumns.splice(filterIndex, 1);
		}
	}

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>

<div class="relative group" on:click={toggleDropdown} on:keypress={null}>
	<button class="bg-gray-200 p-2 rounded-none w-full text-black hover:bg-gray-300">
		Choose Field
	</button>
	<div
		class={`
			 scrollBarDiv bg-gray-900 absolute w-full mt-2 border
			 rounded shadow-lg transform transition-transform 
			 origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
	>
		{#each items as item (item)}
			<button
				class="block w-full bg-gray-900 text-left px-3 py-2 dark:text-gray-400 hover:bg-gray-200"
				on:click={() => updateFilter(item)}
			>
				{column}
			</button>
		{/each}
	</div>
	{#if filterValues.length > 0}
		<Tags items={filterValues} removeItem={removeSelectedTag} />
	{/if}
</div>

<style>
	/* For WebKit (Chrome, Safari) */
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
</style>
