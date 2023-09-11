<script lang="ts">
	import {
		columnLabel,
		getColumnsFromFile,
		clickedChartIndex,
		chartOptions,
		allCharts
	} from '$lib/io/Stores'; //@ts-ignore

	export let axis = '';

	let tags: Array<string | null> = [];
	let isDropdownOpen: boolean = false;

	$: i = clickedChartIndex();
	$: drawerOptions = chartOptions();
	$: columns = getColumnsFromFile();
	$: label = columnLabel(axis);

	$: if ($drawerOptions.xColumn && $drawerOptions.yColumn && tags.length == 0) {
		tags = getTagsOnClick();
	}

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		if (axis.toUpperCase() === 'X') {
			tags = $allCharts[$i]?.xColumn ? [$allCharts[$i].xColumn] : [];
		} else if (axis.toUpperCase() === 'Y') {
			tags = $allCharts[$i]?.yColumn ? [$allCharts[$i].yColumn] : [];
		}
	}

	const getTagsOnClick = () => {
		tags = [];
		if (axis.toUpperCase() === 'X') {
			if ($drawerOptions?.xColumn) {
				tags = [$drawerOptions?.xColumn];
			} else {
				tags = [];
			}
		}
		if (axis.toUpperCase() === 'Y') {
			if ($drawerOptions?.yColumn) {
				tags = [$drawerOptions?.yColumn];
			} else {
				tags = [];
			}
		}
		return tags;
	};

	const chooseColumn = (column: string | null) => {
		if (column) {
			allCharts.update((charts) => {
				if (axis.toUpperCase() === 'X') {
					charts[$i].xColumn = column;
					tags = [column];
				}
				if (axis.toUpperCase() === 'Y') {
					charts[$i].yColumn = column;
					tags = [column];
				}
				return charts;
			});
		} else {
			tags = [];
		}
	};
	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>

<div class="relative group" on:click={toggleDropdown} on:keypress={null}>
	<button class="h-8 w-full button px-2 text-left text-gray-300 shadow-sm">
		{$label}
	</button>
	<div
		class={`
			 scrollBarDiv absolute w-full mt-2 border
			 rounded shadow-lg transform transition-transform 
			 origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
	>
		{#each $columns as column (column)}
			<button
				class="block w-full text-left button px-3 py-2 text-white"
				on:click={() => {
					chooseColumn(column);
				}}
			>
				{column}
			</button>
		{/each}
	</div>
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}

	.button {
		background-color: #2a2a2a;
	}
</style>
