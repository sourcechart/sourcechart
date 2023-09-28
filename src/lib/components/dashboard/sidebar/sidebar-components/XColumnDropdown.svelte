<script lang="ts">
	import { onDestroy } from 'svelte';
	import { clickedChartIndex, allCharts, getColumnsFromFile } from '$lib/io/Stores';

	export let open = false;
	let currentValue: string = '';

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
			class="bg-neutral-900 w-full justify-center text-center rounded-sm hover:bg-neutral-900/50 flex-grow flex items-center mx-auto border-neutral-700/50"
			on:click={() => (open = !open)}
		>
			<span class="text-sm text-neutral-300 ml-1">X</span>
			<span class="text-sm text-gray-100 w-full"> {currentValue} </span>
		</button>
	</div>

	{#if open}
		<div
			class="scrollBarDiv absolute top-0 rounded-md bg-neutral-900 left-0 mt-5 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
		>
			{#each $columns as column}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300"
					on:click={() => handleChoose(column)}
				>
					{column}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 4px; /* Change this value to make the scrollbar thinner or thicker */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 2px; /* Adjust the border-radius as per the new width */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin; /* This property can have values of "none", "auto", "thin", and "wide" */
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
	}
</style>
