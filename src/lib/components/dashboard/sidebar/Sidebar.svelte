<script lang="ts">
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import Download from '$lib/components/ui/icons/Download.svelte';
	import Baseline from '$lib/components/ui/icons/Baseline.svelte';
	import CarrotDown from '$lib/components/ui/icons/CarrotDown.svelte';
	//import LegendColumn from './sidebar-components/LegendColumn.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import XColumnDropdown from './sidebar-components/XColumnDropdown.svelte';
	import YColumnDropdown from './sidebar-components/YColumnDropdown.svelte';

	//import ColumnDropDown from './sidebar-components/ColumnDropDrown.svelte';
	import Groupby from './sidebar-components/Groupby.svelte';
	import Aggregator from './sidebar-components/Aggregator.svelte';
	import FileUploadButton from './sidebar-components/FileUploadButton.svelte';
	import ChartDropdown from './sidebar-components/ChartDropdown.svelte';
	import AddFilter from './sidebar-components/AddFilter.svelte';
	import ExportToCSV from './sidebar-components/ExportToCSV.svelte';
</script>

{#if $activeSidebar}
	<div
		use:clickInside={{ clickInside: () => ($activeSidebar = true) }}
		class="bg-neutral-800 border border-1 border-black fixed overflow-hidden h-3/4 w-72 rounded-md shadow-lg"
	>
		<div
			class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full divide-y divide-neutral-700/80"
		>
			<div class="py-2 px-1 w-full hover:bg-[#303030] hover:round-md">
				<div class="my-2 px-1 flex flex-row items-center justify-between space-x-2">
					<span class="text-sm text-neutral-300 px-2">Dataset</span>
					<PlusSolid />
				</div>
				<div class="px-3">
					<DatasetDropDown />
				</div>
			</div>
			<div class="py-2 px-3 w-full">
				<div class="flex items-center">
					<div
						class="border border-1 hover:border-neutral-700 border-neutral-800 px-2 flex items-center w-1/2"
					>
						<XColumnDropdown />
					</div>

					<div class="border border-1 hover:border-neutral-700 border-neutral-800 px-1 flex w-1/2">
						<YColumnDropdown />
					</div>
				</div>
				<div class="mt-1 hover:bg-[#303030] hover:round-md">
					<div class="border border-1 hover:border-neutral-700 border-neutral-800 px-1">
						<div class="flex justify-between items-center">
							<span class="text-xs text-neutral-300">Groupby</span>
							<CarrotDown />
						</div>
					</div>
				</div>
				<div class="mt-3 px-1">
					<div class="flex justify-between items-center" />
				</div>
			</div>
			<!--Filters-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between">
						<span class="text-sm font-light text-neutral-300"> Filters </span>
						<PlusSolid />
					</div>
				</button>
			</div>
			<!--Options-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between">
						<span class="text-sm font-light text-neutral-300">Style</span>
						<Baseline />
					</div>
				</button>
			</div>
			<!--Export-->
			<div class="py-2 px-3 hover:bg-[#303030] hover:round-md">
				<button class="w-full">
					<div class="flex justify-between">
						<span class="text-sm font-light text-neutral-300">Export</span>
						<Download />
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
