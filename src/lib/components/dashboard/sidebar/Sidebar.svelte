<script lang="ts">
	import Filter from './sidebar-components/filter-components/Filter.svelte';
	import FilterIcon from '$lib/components/ui/icons/FilterIcon.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import XColumnDropdown from './sidebar-components/XColumnDropdown.svelte';
	import YColumnDropdown from './sidebar-components/YColumnDropdown.svelte';
	import Groupby from './sidebar-components/Groupby.svelte';
	import ChartDropdown from './sidebar-components/ChartDropdown.svelte';
	import AddFilter from './sidebar-components/AddFilter.svelte';
	import ExportToCSV from './sidebar-components/ExportToCSV.svelte';
	import { clickInside } from '$lib/actions/MouseActions';
	import { DataIO } from '$lib/io/DataIO';

	import {
		activeSidebar,
		activeDropZone,
		clickedChartIndex,
		allCharts,
		duckDBInstanceStore,
		responsiveType
	} from '$lib/io/Stores';
	import Group from '$lib/components/ui/icons/Group.svelte';

	import DataVisIcon from '$lib/components/ui/icons/DataVisIcon.svelte';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import Info from '$lib/components/ui/icons/Info.svelte';
	import ArrowDown from '$lib/components/ui/icons/ArrowDown.svelte';
	$: i = clickedChartIndex();
	$: filterColumns = $allCharts[$i]?.filterColumns ? $allCharts[$i].filterColumns : [];

	$: chartConfig = $allCharts[$i];

	const exportToCSV = async () => {
		const db = $duckDBInstanceStore;
		const data = new DataIO(db, chartConfig);
		await data.queryExportCSV();
	};
</script>

{#if $activeSidebar}
	<div
		use:clickInside={{ clickInside: () => ($activeSidebar = true) }}
		class="bg-neutral-800 fixed overflow-hidden h-3/4 w-72 rounded-md shadow-lg mt-10"
	>
		<div
			class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full divide-y divide-neutral-700/80"
		>
			<div class="py-2 px-3 hover:bg-[#303030] hover:rounded-md">
				<div class="w-full flex justify-between items-center ml-0">
					<DatasetDropDown />
				</div>
			</div>

			<!-- X and Y dropdown-->
			<div class="py-2 px-3 w-full hover:bg-[#303030]">
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
			<div class="py-2 px-3 hover:bg-[#303030]">
				<div class="my-1">
					<Groupby />
				</div>
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
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between items-center">
						<span class="text-sm font-light text-neutral-300">Style</span>
						<ChartDropdown />
					</div>
				</button>
			</div>

			<!--Export-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<ExportToCSV />
			</div>
			<div />
		</div>
	</div>
{:else}
	<div
		use:clickInside={{ clickInside: () => ($activeSidebar = true) }}
		on:click={() => ($activeSidebar = true)}
		on:keypress={() => ($activeSidebar = true)}
		class="bg-neutral-800 fixed overflow-hidden rounded-md shadow-lg mt-20"
	>
		<div
			class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full divide-y divide-neutral-700/80"
		>
			<!-- Plus Solid -->
			<div class="p-6 hover:bg-[#303030]">
				<button on:click={() => activeDropZone.set(true)}>
					<PlusSolid class="h-5 w-5 hover:text-neutral-300" />
				</button>
			</div>

			<div class="p-6 hover:bg-[#303030]">
				<DataVisIcon class="h-5 w-5 hover:text-neutral-300" />
			</div>

			<!-- Group -->
			<div class="p-6 hover:bg-[#303030]">
				<Group class="h-5 w-5 hover:text-neutral-300" />
			</div>

			<!-- Aggregator -->

			<!-- Info -->
			<div class="p-6 hover:bg-[#303030]">
				<Info class="h-5 w-5 hover:text-neutral-300" />
			</div>

			<!-- Arrow Down -->

			<!-- Filter -->
			<div class="p-6 hover:bg-[#303030]">
				<AddFilter />
			</div>

			<div class="p-6 hover:bg-[#303030]">
				<button on:click={exportToCSV}>
					<ArrowDown class="h-5 w-5 hover:text-neutral-300" />
				</button>
			</div>

			<!-- Other original components can be added here as needed -->
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
