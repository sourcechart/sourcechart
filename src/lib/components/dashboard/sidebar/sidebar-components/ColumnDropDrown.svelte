<script lang="ts">
	import { getColumnsFromFile, clickedChartIndex, allCharts } from '$lib/io/Stores';
	import ArrowDown from '$lib/components/ui/icons/ArrowDown.svelte';
	import { onDestroy } from 'svelte';

	let currentAxis = '';
	let xAxisValue = 'Select Column';
	let yAxisValue = 'Select Column';
	let xDropdownOpen = false;
	let yDropdownOpen = false;
	let xDropdownContainer: HTMLElement;
	let yDropdownContainer: HTMLElement;

	let showColumnDropdown = false;

	$: i = clickedChartIndex();
	$: columns = getColumnsFromFile();

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		//@ts-ignore
		xAxisValue = $allCharts[$i]?.xColumn || 'Select Column'; //@ts-ignore
		yAxisValue = $allCharts[$i]?.yColumn || 'Select Column';
	}

	const toggleDropdown = (axis: string) => {
		currentAxis = axis;
		xDropdownOpen = axis === 'X' ? !xDropdownOpen : false;
		yDropdownOpen = axis === 'Y' ? !yDropdownOpen : false;
	};

	const chooseColumn = (column: string) => {
		allCharts.update((charts) => {
			if (currentAxis === 'X') {
				//@ts-ignore
				charts[$i].xColumn = column;
				xAxisValue = column;
			}
			if (currentAxis === 'Y') {
				//@ts-ignore
				charts[$i].yColumn = column;
				yAxisValue = column;

				const selectedColumnSchema = $allCharts[$i].schema.find(
					(item: { name: string }) => item.name === column
				);

				if (selectedColumnSchema && selectedColumnSchema.type === 'string') {
					charts[$i].aggregator = 'count'; //@ts-ignore
					if (charts[$i].xColumn) charts[$i].groupbyColumns = [charts[$i].xColumn];
				}
			}
			return charts;
		});
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (
			xDropdownContainer &&
			!xDropdownContainer.contains(event.target as Node) &&
			yDropdownContainer &&
			!yDropdownContainer.contains(event.target as Node)
		) {
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

<div class="w-full px-4 py-2 rounded-sm relative mb-4 font-mono">
	<div class="flex justify-between">
		<button
			on:click={() => {
				showColumnDropdown = !showColumnDropdown;
			}}
		>
			<span class="text-xs font-bold">Columns</span>
		</button>
		<button
			on:click={() => {
				showColumnDropdown = !showColumnDropdown;
			}}
		>
			<ArrowDown />
		</button>
	</div>

	{#if showColumnDropdown}
		<div class="flex items-center mt-1">
			<!-- X Section -->
			<div class="flex-grow relative w-1/2">
				<button
					bind:this={xDropdownContainer}
					class="w-full px-2 rounded-sm hover:bg-gray-300 flex items-center"
					on:click={() => toggleDropdown('X')}
				>
					<span class="text-sm ml-2 text-slate-100"> {yAxisValue} </span>
				</button>

				{#if xDropdownOpen}
					<div
						class="scrollBarDiv bg-gray-900 absolute top-0 left-full mt-0 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
					>
						{#each $columns as column}
							<button
								class="block w-full text-left px-3 py-2 hover:bg-gray-200"
								on:click={() => chooseColumn(column)}
							>
								{column}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Y Section -->
			<div class="flex-grow relative w-1/2">
				<button
					bind:this={yDropdownContainer}
					class="w-full px-2 rounded-sm hover:bg-gray-300 flex items-center"
					on:click={() => toggleDropdown('Y')}
				>
					<span class="text-sm ml-2 text-slate-100"> {yAxisValue} </span>
				</button>

				{#if yDropdownOpen}
					<div
						class="scrollBarDiv bg-gray-900 absolute top-0 left-full mt-0 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
					>
						{#each $columns as column}
							<button
								class="text-left text-xs px-3 py-2 w-full bg-neutral-900 hover:bg-gray-700 cursor-pointer truncate pr-8 relative"
								on:click={() => chooseColumn(column)}
							>
								{column}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Oxygen+Mono:wght@400;500;700&display=swap"
/>

<style>
	.font-mono {
		font-family: 'Oxygen Mono', monospace;
	}
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
		max-height: 200px; /* Adjust this value to your desired maximum height */
		overflow-y: auto;
	}
</style>
