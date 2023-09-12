<script lang="ts">
	//@ts-ignore
	import { fileDropdown } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores'; //@ts-ignore
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid, ChevronRightSolid } from 'flowbite-svelte-icons'; //@ts-ignore

	import {
		ColumnDropDown,
		Aggregator,
		Groupby,
		ChartDropdown,
		AddFilter
	} from './sidebar-components'; //@ts-ignore

	let showAxis = true;
	let showAggregator = true;
	let showGroupBy = true;
	let showChart = true;
	let datasetDropdown = true;
	let showFilter = true;

	$: numberOfDatasets = fileDropdown();
	let addFilterDistance: number = 0;
</script>

{#if $activeSidebar}
	<div use:clickInside={{ clickInside: () => ($activeSidebar = true) }} class="sidebar-outer">
		<div class="sidebar-inner">
			<!-- Choose Axis -->
			<div>
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100 button"
					on:click={() => {
						showAxis = !showAxis;
					}}
				>
					<span class="mr-4 text-xs">Axis</span>
					{#if showAxis}
						<ChevronDownSolid class="w-2 h-2" />
					{:else}
						<ChevronRightSolid class="w-2 h-2" />
					{/if}
				</button>
				{#if showAxis}
					<div transition:slide>
						<div class="rounded-t-none px-6 py-4 selectedButtonColor">
							<div
								class="mb-2 text-left font-medium text-gray-400 flex items-center justify-between"
							>
								<p class="text-xs">X Axis</p>
								<ColumnDropDown axis="x" />
							</div>
							<div
								class="mb-2 text-left font-medium text-gray-400 flex items-center justify-between"
							>
								<p class="text-xs">Y Axis</p>
								<ColumnDropDown axis="y" />
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Group By -->
			<div>
				<button
					class="w-full transform h-10 shadow-md transition-transform buttonColor px-2"
					on:click={() => (showGroupBy = !showGroupBy)}
				>
					<div class="flex items-center justify-between text-xl text-gray-300 hover:text-gray-100">
						<span class="mr-4 hover:underline text-xs">GroupBy</span>
						{#if showGroupBy}
							<ChevronDownSolid class="w-4 h-4" />
						{:else}
							<ChevronRightSolid class="w-4 h-4" />
						{/if}
					</div>
				</button>
				{#if showGroupBy}
					<div transition:slide>
						<div class="rounded-t-none px-6 py-4 selectedButtonColor">
							<div class="mb-2 text-left font-medium text-gray-400" />
							<div class="mb-4 flex flex-col">
								<Groupby />
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Chart Dropdown -->
			<div>
				<button
					class="w-full transform h-10 shadow-md transition-transform buttonColor px-2"
					on:click={() => (showChart = !showChart)}
				>
					<div class="flex items-center justify-between text-xl text-gray-300 hover:text-gray-100">
						<span class="mr-4 hover:underline text-xs">Chart</span>
						{#if showChart}
							<ChevronDownSolid class="w-4 h-4" />
						{:else}
							<ChevronRightSolid class="w-4 h-4" />
						{/if}
					</div>
				</button>
				{#if showChart}
					<div transition:slide>
						<div class="rounded-t-none px-6 py-4 selectedButtonColor">
							<div class="mb-2 text-left font-medium text-gray-400" />
							<div class="mb-4 flex flex-col">
								<ChartDropdown sideBarVersion={'LowCode'} />
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Aggregator -->
			<div>
				<button
					class="w-full transform h-10 shadow-md transition-transform buttonColor px-2"
					on:click={() => (showAggregator = !showAggregator)}
				>
					<div class="flex items-center justify-between text-xl text-gray-300 hover:text-gray-100">
						<span class="mr-4 hover:underline text-xs">Aggregator</span>
						{#if showAggregator}
							<ChevronDownSolid class="w-4 h-4" />
						{:else}
							<ChevronRightSolid class="w-4 h-4" />
						{/if}
					</div>
				</button>
				{#if showAggregator}
					<div transition:slide>
						<div class="rounded-t-none px-6 py-4 selectedButtonColor">
							<div class="mb-2 text-left font-medium text-gray-400" />
							<div class="mb-4 flex flex-col">
								<Aggregator />
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Filter -->
			<div>
				<button
					class="w-full transform h-10 shadow-md transition-transform buttonColor px-2"
					on:click={() => {
						showFilter = !showFilter;
					}}
				>
					<div class="flex items-center justify-between text-xl text-gray-300 hover:text-gray-100">
						<span class="mr-4 hover:underline text-xs">Filters</span>
						{#if showFilter}
							<ChevronDownSolid class="w-4 h-4" />
						{:else}
							<ChevronRightSolid class="w-4 h-4" />
						{/if}
					</div>
				</button>
				{#if showFilter}
					<div transition:slide>
						<div class="rounded-t-none px-6 py-4 selectedButtonColor">
							<div class="mb-2 text-left font-medium text-gray-400" />
							<div class="mb-4 flex flex-col">
								<AddFilter />
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.sidebar-outer {
		position: fixed;
		width: 250px;
		overflow: hidden;
		height: 75vh;
		background-color: rgb(38, 38, 39);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.sidebar-inner {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding: 1rem;
	}

	/* Scrollbar styles */
	.sidebar-inner::-webkit-scrollbar {
		width: 4px;
	}

	.sidebar-inner::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.sidebar-inner::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	.sidebar-inner {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1);
	}

	.button:hover {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}
</style>
