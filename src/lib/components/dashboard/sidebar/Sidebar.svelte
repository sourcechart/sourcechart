<script lang="ts">
	import Filter from './sidebar-components/filter-components/Filter.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import XColumnDropdown from './sidebar-components/XColumnDropdown.svelte';
	import YColumnDropdown from './sidebar-components/YColumnDropdown.svelte';
	import Groupby from './sidebar-components/Groupby.svelte';
	import ChartDropdown from './sidebar-components/ChartDropdown.svelte';
	import AddFilter from './sidebar-components/AddFilter.svelte';
	import ExportToCSV from './sidebar-components/ExportToCSV.svelte';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar, clickedChartIndex, allCharts, lockSidebar } from '$lib/io/Stores';
	import ChevronDown from '$lib/components/ui/icons/ChevronDown.svelte';
	import ChevronLeft from '$lib/components/ui/icons/ChevronLeft.svelte';
	import ChevronRight from '$lib/components/ui/icons/ChevronRight.svelte';

	$: i = clickedChartIndex();
	$: filterColumns = $allCharts[$i]?.filterColumns ? $allCharts[$i].filterColumns : [];
</script>

<div class="flex fixed overflow-hidden mt-10 h-full justify-between w-80">
	<div>
		{#if $activeSidebar || ($lockSidebar && !$activeSidebar)}
			<div
				use:clickInside={{ clickInside: () => ($activeSidebar = true) }}
				class="bg-neutral-800 fixed overflow-hidden h-3/5 w-72 rounded-md shadow-lg"
			>
				<div
					class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full divide-y divide-neutral-700/80"
				>
					<div class="py-4 px-3 hover:bg-[#303030] hover:rounded-md">
						<div class="w-full flex justify-between items-center ml-0">
							<DatasetDropDown />
						</div>
					</div>

					<!-- X and Y dropdown-->
					<div class="py-4 px-3 w-full hover:bg-[#303030]">
						<div class="flex items-center justify-between space-x-3 mt-1">
							<span class="text-sm text-neutral-300">Select</span>
							<div class="w-1/2 flex">
								<XColumnDropdown />
							</div>
							<div class="w-1/2 flex">
								<YColumnDropdown />
							</div>
						</div>
					</div>

					<!--GroupBy-->
					<div class="py-4 px-3 hover:bg-[#303030]">
						<div class="my-1">
							<Groupby />
						</div>
					</div>

					<!--Filters-->
					<div class="py-4 px-3 hover:bg-[#303030] hover:round-md">
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

					<!--Analysis-->
					<!--
						<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
							<button class="w-full">
								<div class="flex justify-between items-center">
									<span class="text-sm font-light text-neutral-300">Analysis</span>
								</div>
							</button>
						</div>
					-->

					<!--Options-->
					<div class="py-4 px-3 hover:bg-[#303030] hover:round-md">
						<button class="w-full">
							<div class="flex justify-between items-center">
								<span class="text-sm font-light text-neutral-300">Style</span>
								<ChartDropdown />
							</div>
						</button>
					</div>

					<!--Export-->
					<div class="py-4 px-3 hover:bg-[#303030] hover:round-md">
						<ExportToCSV />
					</div>
					<div>
						<div />
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div
		class="transform transition-transform ease-out duration-200 {$activeSidebar || $lockSidebar
			? 'translate-x-0'
			: '-translate-x-72'}"
	>
		<button
			class="bg-neutral-600 h-5 w-5 rounded-sm flex justify-center items-center hover:bg-neutral-600/80 mt-1"
			on:click={() => {
				$lockSidebar = !$lockSidebar;
			}}
		>
			{#if $lockSidebar}
				<ChevronDown class="hover:text-neutral-300 text-neutral-200" />
			{:else if !$activeSidebar && !$lockSidebar}
				<ChevronRight class="hover:text-neutral-300 text-neutral-200" />
			{:else}
				<ChevronLeft class="hover:text-neutral-300 text-neutral-200" />
			{/if}
		</button>
	</div>
</div>

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
