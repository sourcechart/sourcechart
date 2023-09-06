<script lang="ts">
	import { slide } from 'svelte/transition';
	import { ChevronDownSolid } from 'flowbite-svelte-icons';

	import {
		ColumnDropDrown,
		Aggregator,
		Groupby,
		ChartDropdown,
		Tags,
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
			<p class="text-gray-400">Axis</p>
			<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
		</Button>
		{#if showAxis}
			<div transition:slide>
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
			<p class="text-gray-400">Groupby</p>
			<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
		</Button>
		{#if showGroupBy}
			<div transition:slide>
				<Groupby ButtonName={'Attributes'} />
				<Tags />
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
			<p class="text-gray-400">Aggregator</p>
			<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
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
			<p class="text-gray-400">Choose Chart</p>
			<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
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
			<p class="text-gray-400">Filter</p>
			<ChevronDownSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
		</Button>
		{#if showFilter}
			<div transition:slide>
				<AddFilter />
			</div>
		{/if}
	</div>
</div>
