<script lang="ts">
	//@ts-ignore
	import { fileDropdown } from '$lib/io/Stores';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores'; //@ts-ignore

	import {
		ColumnDropDown,
		Aggregator,
		Groupby,
		ChartDropdown,
		AddFilter
	} from './sidebar-components'; //@ts-ignore
	import ColumnDropDrown from './sidebar-components/ColumnDropDrown.svelte';

	$: numberOfDatasets = fileDropdown();
	let addFilterDistance: number = 0;
</script>

{#if $activeSidebar}
	<div use:clickInside={{ clickInside: () => ($activeSidebar = true) }} class="sidebar-outer">
		<div class="sidebar-inner">
			<!-- Chart Dropdown -->
			<div class="mb-4">
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Chart</span>
				</button>

				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4"
					>
						<ChartDropdown sideBarVersion={'LowCode'} />
					</div>
				</div>
			</div>
			<!-- Choose Axis -->
			<div class="mb-4">
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Axis</span>
				</button>

				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4"
					>
						<p class="text-xs">X Axis</p>
						<ColumnDropDrown axis={'x'} />
					</div>
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4"
					>
						<p class="text-xs">Y Axis</p>
						<ColumnDropDown axis={'y'} />
					</div>
				</div>
			</div>
			<!-- Group By -->
			<div class="mb-4">
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Groupby</span>
				</button>
				<div class="font-medium text-gray-400 w-full justify-items-center">
					<Groupby />
				</div>
			</div>

			<!-- Aggregator -->
			<div class="mb-4">
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Aggregator</span>
				</button>

				<div class="rounded-t-none selectedButtonColor">
					<div class="w-full font-medium text-gray-400 flex items-center justify-between">
						<Aggregator />
					</div>
				</div>
			</div>

			<!-- Filter -->
			<div>
				<button
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Filters</span>
				</button>

				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-center font-medium text-gray-400 flex items-center justify-between space-x-4"
					>
						<AddFilter />
					</div>
				</div>
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
</style>
