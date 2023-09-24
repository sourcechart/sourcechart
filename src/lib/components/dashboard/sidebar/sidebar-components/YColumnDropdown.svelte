<script lang="ts">
	import { onDestroy } from 'svelte';

	import { clickedChartIndex, allCharts, getColumnsFromFile } from '$lib/io/Stores';
	export let open = false;
	let currentValue: string = 'Select Column';

	let testColumns = ['test1', 'test2', 'test3'];

	$: i = clickedChartIndex();
	$: columns = getColumnsFromFile();
	let container: HTMLElement;

	const handleChoose = (column: string) => {
		allCharts.update((charts) => {
			charts[$i].yColumn = column;
			currentValue = column;
			const selectedColumnSchema = $allCharts[$i].schema.find(
				(item: { name: string }) => item.name === column
			);

			if (selectedColumnSchema && selectedColumnSchema.type === 'string') {
				charts[$i].aggregator = 'count'; //@ts-ignore
				if (charts[$i].xColumn) charts[$i].groupbyColumns = [charts[$i].xColumn];
			}
			return charts;
		});
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (container && !container.contains(event.target as Node)) {
			open = false;
		}
	};

	$: {
		if (open) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div bind:this={container} class="flex-grow relative">
	<div class="flex items-center">
		<span class="text-xs text-neutral-300">Y</span>
		<button
			class="ml-3 bg-neutral-900/80 w-full rounded-sm justify-center hover:bg-neutral-900/50 flex-grow flex items-center text-center"
			on:click={() => (open = !open)}
		>
			<span class="text-xs text-slate-100 w-full"> {currentValue} </span>
		</button>
	</div>
	{#if open}
		<div
			class="scrollBarDiv bg-neutral-900 absolute top-0 left-0 mt-5 border transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
		>
			{#each $columns as column}
				<button
					class="block w-full text-left px-3 py-2 text-white"
					on:click={() => handleChoose(column)}
				>
					{column}
				</button>
			{/each}
		</div>
	{/if}
</div>
