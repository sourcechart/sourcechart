<script lang="ts">
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';
	//import LegendColumn from './sidebar-components/LegendColumn.svelte';
	import DatasetDropDown from './sidebar-components/DatasetDropDown.svelte';
	import ColumnDropDown from './sidebar-components/ColumnDropDrown.svelte';
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
		class=" bg-neutral-800 border border-1 border-black fixed overflow-hidden h-3/4 w-72 rounded-md shadow-lg divide-y"
	>
		<div class="overflow-y-auto overflow-x-hidden sidebar-inner w-full h-full mt-2 mb-2 divide-y">
			<!-- Adjusted margins for larger spaces between dividers -->
			<FileUploadButton />
			<DatasetDropDown />
			<ChartDropdown sideBarVersion={'LowCode'} />
			<ColumnDropDown />
			<Groupby />
			<Aggregator />
			<AddFilter />
			<ExportToCSV />
			<!-- Commented section can be added later if needed -->
		</div>
	</div>
{/if}

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
