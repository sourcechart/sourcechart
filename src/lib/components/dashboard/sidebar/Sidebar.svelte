<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import { fileDropdown } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeDropZone, activeSidebar, allCharts, mostRecentChartID } from '$lib/io/Stores'; //@ts-ignore
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid, ChevronUpSolid } from 'flowbite-svelte-icons'; //@ts-ignore

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
	let showFilter = false;
	//@ts-ignore
	export let data;

	const handleClickInside = () => {
		$activeSidebar = true;
	};

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

	$: numberOfDatasets = fileDropdown();

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

{#if $activeSidebar}
	<div use:clickInside={{ clickInside: handleClickInside }} class="space-y-4">
		<div class="outerDiv">
			<div
				class="innerDiv bg-gray-800 text-white w-full h-full transition-transform duration-200 ease-in-out rounded-md border-red-50 p-6"
			>
				<div class="flex flex-col space-y-1 mt-2 mb-2">
					<Button outline color="light" id="multiple_files" on:click={handleClick}>
						<div class="flex justify-between items-center w-full">
							<span>Add Dataset [{$numberOfDatasets.length}]</span>
							<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
						</div>
					</Button>
				</div>
				<div class="flex flex-col space-y-1">
					<DatasetDropDown />
				</div>
				<div class="divide-y">
					<div class="space-y-3 mt-3 flex flex-col">
						<div class="flex flex-col space-y-1">
							<Button
								pill={false}
								outline
								color="light"
								on:click={() => {
									showAxis = !showAxis;
								}}
							>
								<div class="flex justify-between items-center w-full">
									<span>Axis</span>
									{#if showAxis}
										<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
									{:else}
										<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
									{/if}
								</div>
							</Button>
							{#if showAxis}
								<div transition:slide class="space-y-2">
									<ColumnDropDrown axis={'X'} />
									<ColumnDropDrown axis={'Y'} />
								</div>
							{/if}
						</div>
						<div class="flex flex-col space-y-1">
							<Button
								pill={false}
								outline
								color="light"
								on:click={() => {
									showGroupBy = !showGroupBy;
								}}
							>
								<div class="flex justify-between items-center w-full">
									<span>Groupby</span>
									{#if showGroupBy}
										<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
									{:else}
										<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
									{/if}
								</div>
							</Button>
							{#if showGroupBy}
								<div transition:slide>
									<Groupby ButtonName={'Attributes'} />
								</div>
							{/if}
						</div>
						<div class="flex flex-col space-y-1">
							<Button
								pill={false}
								outline
								color="light"
								on:click={() => {
									showAggregator = !showAggregator;
								}}
							>
								<div class="flex justify-between items-center w-full">
									<span>Aggregator</span>
									{#if showAggregator}
										<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
									{:else}
										<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
									{/if}
								</div>
							</Button>
							{#if showAggregator}
								<div transition:slide>
									<Aggregator />
								</div>
							{/if}
						</div>
						<div class="flex flex-col space-y-1">
							<Button
								pill={false}
								outline
								color="light"
								on:click={() => {
									showChart = !showChart;
								}}
							>
								<div class="flex justify-between items-center w-full">
									<span>Choose Chart</span>
									{#if showChart}
										<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
									{:else}
										<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
									{/if}
								</div>
							</Button>
							{#if showChart}
								<div transition:slide>
									<ChartDropdown sideBarVersion={'LowCode'} />
								</div>
							{/if}
						</div>
						<div class="flex flex-col space-y-1 z-40">
							<Button
								pill={false}
								outline
								color="light"
								on:click={() => {
									showFilter = !showFilter;
								}}
							>
								<div class="flex justify-between items-center w-full">
									<span>Add Filter</span>
									{#if showFilter}
										<ChevronUpSolid class="w-3 h-3 text-white dark:text-white" />
									{:else}
										<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
									{/if}
								</div>
							</Button>
							{#if showFilter}
								<div transition:slide>
									<AddFilter />
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.outerDiv {
		position: fixed;
		width: 300px;
		overflow: hidden;
		height: 75vh;
	}

	.innerDiv {
		width: 100%;
		height: 100%;
		overflow-y: auto;
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
