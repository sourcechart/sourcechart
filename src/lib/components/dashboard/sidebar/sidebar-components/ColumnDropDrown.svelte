<script lang="ts">
	import {
		columnLabel,
		getColumnsFromFile,
		clickedChartIndex,
		chartOptions,
		allCharts
	} from '$lib/io/Stores'; //@ts-ignore

	import Tags from '$lib/components/ui/tags/Tags.svelte';
	//export let axis = '';

	let tags: Array<{ label: string; value: string }> = []; // Updated tags to contain label (X/Y) and value (column)
	let isDropdownOpen: boolean = false;

	$: i = clickedChartIndex();
	//$: drawerOptions = chartOptions();
	$: columns = getColumnsFromFile();

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		tags = [
			{ label: 'X', value: $allCharts[$i]?.xColumn || '' },
			{ label: 'Y', value: $allCharts[$i]?.yColumn || '' }
		];
	}

	const chooseColumn = (label: string, column: string) => {
		allCharts.update((charts) => {
			if (label === 'X') {
				charts[$i].xColumn = column;
			}
			if (label === 'Y') {
				charts[$i].yColumn = column;
			}
			return charts;
		});
		tags = tags.map((tag) => (tag.label === label ? { label, value: column } : tag));
		toggleDropdown();
	};

	const removeTag = (label: string) => {
		if (label === 'X') {
			chooseColumn(label, '');
		}
		if (label === 'Y') {
			chooseColumn(label, '');
		}
	};

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>

<div class="w-full px-4 py-2 rounded-sm relative selectFieldColor">
	<div class="flex-grow">
		<span class="text-sm"> X Axis </span>
		<button
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={toggleDropdown}
		>
			<span class="text-sm ml-2"> Select Column </span>
		</button>
	</div>

	{#if isDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 h-48"
			on:click|stopPropagation={toggleDropdown}
		>
			<!--
			{#each ['X', 'Y'] as axisLabel}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => chooseColumn(axisLabel, column)}
				>
					{axisLabel}: {column}
				</button>
			{/each}
			-->
		</button>
	{/if}

	<div class="flex-grow">
		<span class="text-sm"> Y Axis </span>
		<button
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={toggleDropdown}
		>
			<span class="text-sm ml-2"> Select Column </span>
		</button>
	</div>
	{#if isDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 h-48"
			on:click|stopPropagation={toggleDropdown}
		>
			<!--
			{#each ['X', 'Y'] as axisLabel}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => chooseColumn(axisLabel, column)}
				>
					{axisLabel}: {column}
				</button>
			{/each}
			-->
		</button>
	{/if}
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.dropdown-content::-webkit-scrollbar {
		width: 8px;
	}

	.dropdown-content::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.dropdown-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.dropdown-content {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}

	.buttonColor {
		background-color: #353f46;
	}

	.selectFieldColor {
		background-color: #33333d;
	}
</style>
