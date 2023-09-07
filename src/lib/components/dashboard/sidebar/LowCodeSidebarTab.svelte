<!--
<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid, ChevronUpSolid } from 'flowbite-svelte-icons'; //@ts-ignore

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
		<div class="absolute">
			<AddFilter />
		</div>
	</div>
</div>
-->
