<script lang="ts">
	import { onDestroy } from 'svelte';
	import { clickedChartIndex, allCharts, getColumnsFromFile } from '$lib/io/Stores';

	export let open = false;
	let currentValue: string = 'Select Column';

	$: i = clickedChartIndex();
	$: columns = getColumnsFromFile();
	let container: HTMLElement;

	$: {
		if (open) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	const handleChoose = (column: string) => {
		allCharts.update((charts) => {
			charts[$i].xColumn = column;
			currentValue = column;

			const selectedColumnSchema = charts[$i].schema.find(
				(item: { name: string }) => item.name === column
			);

			if (selectedColumnSchema && selectedColumnSchema.type === 'string') {
				charts[$i].aggregator = 'count'; //@ts-ignore
				if (charts[$i].yColumn) charts[$i].groupbyColumns = [charts[$i].yColumn];
			}
			return charts;
		});
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (container && !container.contains(event.target as Node)) {
			open = false;
		}
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div bind:this={container} class="flex-grow relative w-full">
	<div class="flex items-center justify-between">
		<button
			class="bg-neutral-900/80 w-full justify-center text-center rounded-sm hover:bg-neutral-900/50 flex-grow flex items-center mx-auto"
			on:click={() => (open = !open)}
		>
			<span class="text-sm text-neutral-300 ml-1">X</span>
			<span class="text-sm text-slate-100 w-full"> {currentValue} </span>
		</button>
	</div>

	{#if open}
		<div
			class="scrollBarDiv bg-neutral-900 rounded-md absolute top-0 left-0 mt-5 border shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
		>
			{#each $columns as column}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200 text-white"
					on:click={() => handleChoose(column)}
				>
					{column}
				</button>
			{/each}
		</div>
	{/if}
</div>
