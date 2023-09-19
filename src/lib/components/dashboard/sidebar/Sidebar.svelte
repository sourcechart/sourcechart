<script lang="ts">
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';
	import LegendColumn from './sidebar-components/LegendColumn.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import ColumnDropDown from './sidebar-components/ColumnDropDrown.svelte';
	import Groupby from './sidebar-components/Groupby.svelte';
	import Aggregator from './sidebar-components/Aggregator.svelte';
	import FileUploadButton from './sidebar-components/FileUploadButton.svelte';
	import ChartDropdown from './sidebar-components/ChartDropdown.svelte';
	import AddFilter from './sidebar-components/AddFilter.svelte';
	import ExportToCSV from './sidebar-components/ExportToCSV.svelte';
	import { onMount } from 'svelte';

	let syncWorker: Worker | undefined = undefined;

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};
	onMount(loadWorker);
</script>

{#if $activeSidebar}
	<div use:clickInside={{ clickInside: () => ($activeSidebar = true) }} class="sidebar-outer">
		<div class="sidebar-inner">
			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Upload Files</span>
				</div>
				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4 shadow-md"
					>
						<FileUploadButton />
					</div>
				</div>
			</div>
			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Choose Dataset</span>
				</div>
				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4 shadow-md"
					>
						<DatasetDropDown />
					</div>
				</div>
			</div>
			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Chart</span>
				</div>
				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4 shadow-md"
					>
						<ChartDropdown sideBarVersion={'LowCode'} />
					</div>
				</div>
			</div>
			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Axis</span>
				</div>
				<div class="rounded-t-none selectedButtonColor">
					<div
						class="text-left font-medium text-gray-400 flex items-center justify-between space-x-4"
					>
						<ColumnDropDown />
					</div>
				</div>
			</div>
			<div class="mb-4">
				<div class="w-full flex items-center justify-between text-gray-300 hover:text-gray-100">
					<span class="mr-4 text-sm">Groupby</span>
				</div>
				<div class="font-medium text-gray-400 w-full justify-items-center shadow-md">
					<Groupby />
				</div>
			</div>

			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Aggregator</span>
				</div>

				<div class="rounded-t-none selectedButtonColor">
					<div class="w-full font-medium text-gray-400 flex items-center justify-between shadow-md">
						<Aggregator />
					</div>
				</div>
			</div>

			<!-- Filter -->
			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Filters</span>
				</div>
				<div class="w-full font-medium">
					<AddFilter />
				</div>
			</div>

			<div class="mb-4">
				<div
					class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
				>
					<span class="mr-4 text-sm">Export</span>
				</div>
				<div class="w-full font-medium">
					<ExportToCSV />
				</div>
				<!--
				<div class="mb-4">
					<div
						class="w-full flex items-center justify-between text-xl text-gray-300 hover:text-gray-100"
					>
						<span class="mr-4 text-sm">Add Legend</span>
					</div>
					<div class="w-full font-medium">
							<LegendColumn />
					</div>

				</div>
				-->
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
		background-color: #262627;
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
