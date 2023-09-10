<script lang="ts">
	//@ts-ignore
	//import Button from 'flowbite-svelte/Button.svelte';
	import { fileDropdown } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores'; //@ts-ignore
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid, ChevronRightSolid } from 'flowbite-svelte-icons'; //@ts-ignore

	import {
		ColumnDropDrown,
		Aggregator,
		Groupby,
		ChartDropdown,
		AddFilter
	} from './sidebar-components'; //@ts-ignore

	let showAxis = false;
	let showAggregator = false;
	let showGroupBy = false;
	let showChart = false;
	let datasetDropdown = false;
	let showFilter = false;

	$: numberOfDatasets = fileDropdown();
	let addFilterDistance: number = 0;
	let sidebarElement: HTMLElement;
	//let addFilterElement: HTMLElement;

	/*
	function clickClusterTab() {
		allCharts.update((charts) => {
			charts.forEach((chart) => {
				if (chart.chartID === $mostRecentChartID) {
					chart.workflow = 'cluster';
				}
			});
			return charts;
		});
	}

	function clickBasicTab() {
		allCharts.update((charts) => {
			charts.forEach((chart) => {
				if (chart.chartID === $mostRecentChartID) {
					chart.workflow = 'basic';
				}
			});
			return charts;
		});
	}

	const calculateDistanceToBottom = () => {
		if (addFilterElement && sidebarElement) {
			const addFilterBottom = addFilterElement.getBoundingClientRect().bottom;
			const sidebarBottom = sidebarElement.getBoundingClientRect().bottom;
			addFilterDistance = sidebarBottom - addFilterBottom;
			return addFilterDistance;
		}
		return 0;
	};
	*/
</script>

{#if $activeSidebar}
	<div
		bind:this={sidebarElement}
		use:clickInside={{
			clickInside: () => {
				$activeSidebar = true;
			}
		}}
		class="space-y-4 outerDiv rounded-md"
	>
		<div
			class="innerDiv text-white w-full h-full space-y-2 transition-transform duration-200 ease-in-out rounded-md border-red-50 p-6"
		>
			<!-- Add Datasets Section-->
			<div class="flex flex-col space-y-1">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						activeDropZone.set(true);
						activeSidebar.set(false);
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>Add Dataset [{$numberOfDatasets.length}]</span>
						<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
					</div>
				</button>
			</div>
			<!-- Dataset Dropdown-->
			<div class="flex flex-col space-y-1">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						datasetDropdown = !datasetDropdown;
					}}
					on:keypress={null}
				>
					<div class="flex justify-between items-center w-full">
						<span>Select Dataset</span>
						{#if datasetDropdown}
							<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
						{:else}
							<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
						{/if}
					</div>
				</button>
				{#if datasetDropdown}
					<div transition:slide>
						<DatasetDropDown />
					</div>
				{/if}
			</div>
			<!--<div class="space-y-3 mt-3 flex flex-col"> -->
			<div class="flex flex-col space-y-1" id="Axis">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						showAxis = !showAxis;
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>Axis</span>
						{#if showAxis}
							<button>
								<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
							</button>
						{:else}
							<button>
								<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
							</button>
						{/if}
					</div>
				</button>
				{#if showAxis}
					<div transition:slide class="space-y-2">
						<ColumnDropDrown axis={'X'} />
						<ColumnDropDrown axis={'Y'} />
					</div>
				{/if}
			</div>
			<div class="flex flex-col space-y-1" id="Groupby">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						showGroupBy = !showGroupBy;
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>GroupBy</span>
						{#if showGroupBy}
							<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
						{:else}
							<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
						{/if}
					</div>
				</button>
				{#if showGroupBy}
					<div transition:slide>
						<Groupby />
					</div>
				{/if}
			</div>
			<div class="flex flex-col space-y-1" id="Aggregator">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						showAggregator = !showAggregator;
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>Aggregator</span>
						{#if showAggregator}
							<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
						{:else}
							<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
						{/if}
					</div>
				</button>
				{#if showAggregator}
					<div transition:slide>
						<Aggregator />
					</div>
				{/if}
			</div>
			<div class="flex flex-col space-y-1" id="ChartDropdown">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						showChart = !showChart;
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>Choose Chart</span>
						{#if showChart}
							<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
						{:else}
							<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
						{/if}
					</div>
				</button>
				{#if showChart}
					<div transition:slide>
						<ChartDropdown sideBarVersion={'LowCode'} />
					</div>
				{/if}
			</div>
			<div class="flex flex-col space-y-1" id="AddFilter">
				<button
					class="h-6 px-4 text-white hover:bg-gray-700"
					on:click={() => {
						showFilter = !showFilter;
					}}
				>
					<div class="flex justify-between items-center w-full">
						<span>Add Filter</span>
						{#if showFilter}
							<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
						{:else}
							<ChevronRightSolid class="w-3 h-3 text-white dark:text-white" />
						{/if}
					</div>
				</button>
				{#if showFilter}
					<div transition:slide>
						<AddFilter {addFilterDistance} />
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.outerDiv {
		background-color: rgb(38, 38, 39);
		position: fixed;
		width: 300px;
		overflow: hidden;
		height: 75vh;
	}

	.innerDiv {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background-color: rgb(38, 38, 39);
	}

	/* For WebKit (Chrome, Safari) */
	.innerDiv::-webkit-scrollbar {
		width: 8px;
	}

	.innerDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.innerDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(255, 255, 255, 0.5);
	}

	/* For Firefox */
	.innerDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1);
	}
</style>
