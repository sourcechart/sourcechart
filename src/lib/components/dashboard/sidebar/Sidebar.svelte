<script lang="ts">
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';
	import Download from '$lib/components/ui/icons/Download.svelte';
	import Baseline from '$lib/components/ui/icons/Baseline.svelte';
	import Filter from './sidebar-components/filter-components/Filter.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import XColumnDropdown from './sidebar-components/XColumnDropdown.svelte';
	import YColumnDropdown from './sidebar-components/YColumnDropdown.svelte';
	import Groupby from './sidebar-components/Groupby.svelte';
	import ChartDropdown from './sidebar-components/ChartDropdown.svelte';
	import AddFilter from './sidebar-components/AddFilter.svelte';
	import ExportToCSV from './sidebar-components/ExportToCSV.svelte';

	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	$: i = clickedChartIndex(); //@ts-ignore
	$: filterColumns = $allCharts[$i]?.filterColumns ? $allCharts[$i].filterColumns : [];
</script>

{#if $activeSidebar}
	<div
		use:clickInside={{ clickInside: () => ($activeSidebar = true) }}
		class="bg-neutral-800 fixed overflow-hidden h-3/4 w-72 rounded-md shadow-lg"
	>
		<div
			class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full divide-y divide-neutral-700/80"
		>
			<div class="py-2 px-3 hover:bg-[#303030] hover:rounded-md">
				<div class="w-full flex justify-between items-center ml-0">
					<DatasetDropDown />
				</div>
			</div>

			<div class="py-2 px-3 w-full hover:bg-[#303030]">
				<span class="text-sm mt-1 text-neutral-300">Query</span>

				<div class="flex items-center justify-between space-x-3 mt-1">
					<div class="flex w-1/2">
						<XColumnDropdown />
					</div>
					<div class="flex w-1/2">
						<YColumnDropdown />
					</div>
				</div>
				<div class="my-4 hover:round-md">
					<Groupby />
				</div>
			</div>

			<!--Options-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between items-center">
						<span class="text-sm font-light text-neutral-300">Style</span>
						<ChartDropdown sideBarVersion="LowCode" />
					</div>
				</button>
			</div>

			<!--Filters-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<div class="flex justify-between items-center w-full">
					<span class="text-sm font-light text-neutral-300">Filters</span>
					<AddFilter />
				</div>

				{#each filterColumns as filterData}
					<div class="mt-2">
						<Filter {filterData} />
					</div>
				{/each}
			</div>

			<!--Export-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between">
						<span class="text-sm font-light text-neutral-300">Export</span>
						<ExportToCSV />
						<div class="ml-3">
							<Download />
						</div>
					</div>
				</button>
			</div>
			<div />
		</div>
	</div>
{/if}

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Oxygen+Mono:wght@400;500;700&display=swap"
/>

<style>
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
