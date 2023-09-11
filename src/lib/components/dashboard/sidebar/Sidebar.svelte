<script lang="ts">
	//@ts-ignore
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

	let showAxis = true;
	let showAggregator = false;
	let showGroupBy = false;
	let showChart = false;
	let datasetDropdown = true;
	let showFilter = false;

	$: numberOfDatasets = fileDropdown();
	let addFilterDistance: number = 0;

	$: console.log(showAxis);
</script>

{#if $activeSidebar}
	<div
		use:clickInside={{
			clickInside: () => {
				$activeSidebar = true;
			}
		}}
		class="space-y-4 outerDiv rounded-md shadow-xl"
	>
		<div
			class="innerDiv text-gray-200 px-3 h-full space-y-2 transition-transform duration-200 ease-in-out rounded-md py-6"
		>
			<button
				class="w-full transform h-10 shadow-md transition-transform buttonColor px-2 border-1"
				on:click={() => (showAxis = !showAxis)}
			>
				<div class="flex items-center justify-between text-xl text-gray-300 hover:text-gray-100">
					<span class="mr-4 hover:underline text-sm">Choose Axis</span>
					{#if showAxis}
						<ChevronDownSolid class="w-4 h-4" />
					{:else}
						<ChevronRightSolid class="w-4 h-4" />
					{/if}
				</div>
			</button>
			{#if showAxis}
				<div transition:slide>
					<div class="rounded-t-none bg-[#252830] px-6 py-4">
						<div class="mb-2 text-left font-medium text-gray-400">
							<p class="text-sm">X Axis</p>
						</div>
						<div class="mb-4 flex flex-col">
							<button
								class="h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-2 text-left text-gray-300 shadow-sm hover:border-gray-500 hover:bg-gray-950"
								>Input</button
							>
						</div>
						<div class="mb-2 text-left font-medium text-gray-400">
							<p class="text-sm">Y Axis</p>
						</div>
						<div class="flex flex-col">
							<button
								class="h-10 w-full rounded-md border border-gray-700 bg-gray-900 px-2 text-left text-gray-300 shadow-sm hover:border-gray-500 hover:bg-gray-950"
								>Input</button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.outerDiv {
		position: fixed;
		width: 250px;
		overflow: hidden;
		height: 75vh;
	}

	.innerDiv {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		background-color: #2a2a2a;
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

	.hoverOptionColor:hover {
		background-color: rgba(61, 61, 61);
		border-radius: 4px;
	}

	.buttonColor {
		border-color: rgba(61, 61, 61);
		border-width: 1px;
		background-color: #1c1c1c;
		border-radius: 1px;
	}

	.buttonColor:hover {
		border-color: rgba(255, 255, 255, 0.3);
		border-width: 1px;
	}
</style>
