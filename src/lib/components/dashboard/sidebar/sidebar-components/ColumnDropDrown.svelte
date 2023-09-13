<script lang="ts">
	import { getColumnsFromFile, clickedChartIndex, allCharts } from '$lib/io/Stores';
	import { onDestroy } from 'svelte';

	let currentAxis = ''; // To differentiate between the X and Y axis buttons
	let xAxisValue = 'Select Column for X Axis';
	let yAxisValue = 'Select Column for Y Axis';
	let xDropdownOpen = false;
	let yDropdownOpen = false;
	let dropdownContainer: HTMLElement;

	$: i = clickedChartIndex();
	$: columns = getColumnsFromFile();

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		xAxisValue = $allCharts[$i]?.xColumn || 'Select Column for X Axis';
		yAxisValue = $allCharts[$i]?.yColumn || 'Select Column for Y Axis';
	}

	const toggleDropdown = (axis: string) => {
		currentAxis = axis;
		if (axis === 'X') {
			xDropdownOpen = !xDropdownOpen;
		}
		if (axis === 'Y') {
			yDropdownOpen = !yDropdownOpen;
		}
	};

	const chooseColumn = (column: string) => {
		allCharts.update((charts) => {
			toggleDropdown(currentAxis);
			if (currentAxis === 'X') {
				charts[$i].xColumn = column;
				xAxisValue = column;
			}
			if (currentAxis === 'Y') {
				charts[$i].yColumn = column;
				yAxisValue = column;
			}
			return charts;
		});
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			xDropdownOpen = false;
			yDropdownOpen = false;
		}
	};

	$: {
		if (xDropdownOpen || yDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div class="w-full px-4 py-2 rounded-sm relative selectFieldColor">
	<div class="flex-grow">
		<span class="text-sm"> X Axis </span>
		<button
			bind:this={dropdownContainer}
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={() => toggleDropdown('X')}
		>
			<span class="text-sm ml-2"> {xAxisValue} </span>
		</button>
	</div>

	{#if xDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			on:click|stopPropagation={() => toggleDropdown('X')}
		>
			{#each $columns as column}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => chooseColumn(column)}
				>
					{column}
				</button>
			{/each}
		</button>
	{/if}

	<div class="flex-grow mt-4">
		<span class="text-sm"> Y Axis </span>
		<button
			bind:this={dropdownContainer}
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={() => toggleDropdown('Y')}
		>
			<span class="text-sm ml-2"> {yAxisValue} </span>
		</button>
	</div>

	{#if yDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			on:click|stopPropagation={() => toggleDropdown('Y')}
		>
			{#each $columns as column}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => chooseColumn(column)}
				>
					{column}
				</button>
			{/each}
		</button>
	{/if}
</div>

<style>
	.selectFieldColor {
		background-color: #33333d;
	}
</style>
