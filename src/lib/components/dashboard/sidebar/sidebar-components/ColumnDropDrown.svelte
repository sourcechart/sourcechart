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

<div class="relative dropdown-container">
	<button class="dropdown-button">
		{$label}
	</button>
	<div class={`dropdown-content ${isDropdownOpen ? 'visible' : ''}`}>
		{#each $columns as column (column)}
			<button class="dropdown-item" on:click={() => chooseColumn(column)}>
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
	.dropdown-container {
		position: relative;
	}

	.dropdown-button {
		background-color: #2a2a2a;
		border: none;
		padding: 0.5rem 1rem;
		color: #fff;
		cursor: pointer;
	}

	.dropdown-content {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		border: 1px solid #333;
		border-radius: 4px;
		background-color: #1c1c1c;
		opacity: 0;
		transform: translateY(-10px);
		transition: opacity 0.3s, transform 0.3s;
		overflow-y: auto;
		max-height: 200px;
	}

	.dropdown-content.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.dropdown-item {
		padding: 0.5rem 1rem;
		color: #fff;
		background-color: #2a2a2a;
		border: none;
		width: 100%;
		text-align: left;
		cursor: pointer;
	}

	.dropdown-item:hover {
		background-color: #333;
	}
</style>
