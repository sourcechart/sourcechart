<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid } from 'flowbite-svelte-icons'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';

	import {
		ColumnDropDrown,
		Aggregator,
		Groupby,
		ChartDropdown,
		AddFilter
	} from './sidebar-components'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';

	let showAxis = false;
	let showAggregator = false;
	let showGroupBy = false;
	let showFilter = false;
	let showChart = false;
</script>

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
				<p class="text-gray-400">Axis</p>
				<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
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
				<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
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
				<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
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
				<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
			</div>
		</Button>
		{#if showChart}
			<div transition:slide>
				<ChartDropdown sideBarVersion={'LowCode'} />
			</div>
		{/if}
	</div>
	<div class="flex flex-col space-y-1">
		<Button
			pill={false}
			outline
			color="light"
			on:click={() => {
				showFilter = !showFilter;
			}}
		>
			<div class="flex justify-between items-center w-full">
				<span>Filter</span>
				<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
			</div>
		</Button>
		{#if showFilter}
			<div transition:slide>
				<AddFilter />
			</div>
		{/if}
	</div>
</div>
