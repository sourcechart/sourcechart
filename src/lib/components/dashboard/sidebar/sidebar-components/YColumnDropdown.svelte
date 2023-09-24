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

<div bind:this={container} class="flex-grow relative w-1/2">
	<button class="w-full px-2 rounded-sm flex items-center" on:click={() => (open = !open)}>
		<span class="text-sm text-neutral-400">Y</span>
		<span class="text-sm ml-2 text-slate-100"> {currentValue} </span>
	</button>

	{#if open}
		<div
			class="scrollBarDiv bg-gray-900 absolute top-0 left-full mt-0 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
		>
			{#each testColumns as column}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => handleChoose(column)}
				>
					{column}
				</button>
			{/each}
		</div>
	{/if}
</div>
