<script lang="ts">
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';
	import { onDestroy } from 'svelte';

	type SideBarVersion = 'WorkFlow' | 'LowCode';
	export let sideBarVersion: SideBarVersion;
	let dropdownContainer: HTMLElement;

	let chosenPlot: string = 'Bar Chart (Default)';
	let isChartDropdownOpen: boolean = false;
	let rectangleCharts: any[] = [
		{ chartType: 'Bar' },
		{ chartType: 'Scatter' },
		{ chartType: 'Pie' },
		{ chartType: 'Line' },
		{ chartType: 'Area' }
	];

	if (sideBarVersion === 'WorkFlow') {
		rectangleCharts = [...rectangleCharts, { chartType: 'Density' }];
	}

	$: {
		if (isChartDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	$: i = clickedChartIndex();

	$: {
		if ($allCharts[$i]?.chartOptions?.series[0]?.type) {
			chosenPlot = capitalizeFirstLetter($allCharts[$i].chartOptions.series[0].type);
		} else {
			chosenPlot = 'Bar Chart (Default)';
		}
	}

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const chooseChart = (plot: string) => {
		chosenPlot = plot;
		plot = plot.toLowerCase();
		allCharts.update((charts) => {
			charts.forEach((chart) => {
				chart.chartType = plot;
				if (plot === 'area') {
					chart.chartOptions.series[0].type = 'line';
					chart.chartOptions.series[0].areaStyle = {};
				} else {
					chart.chartOptions.series[0].type = plot;
				}
			});
			return charts;
		});
	};

	const closeChartDropdown = () => {
		isChartDropdownOpen = false;
	};

	const toggleChartDropdown = () => {
		isChartDropdownOpen = !isChartDropdownOpen;
	};

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			closeChartDropdown();
		}
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div class="w-full p-4 rounded-sm relative selectFieldColor">
	<div class="flex justify-between items-center">
		<button
			bind:this={dropdownContainer}
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={toggleChartDropdown}
		>
			<span class="text-sm ml-2">
				{chosenPlot}
			</span>
		</button>
	</div>

	{#if isChartDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 h-48"
			on:click|stopPropagation={closeChartDropdown}
		>
			{#each rectangleCharts as { chartType }, i (i)}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => {
						chooseChart(chartType);
						isChartDropdownOpen = false;
					}}
				>
					{chartType}
				</button>
			{/each}
		</button>
	{/if}
</div>

<style>
	.selectFieldColor {
		background-color: #33333d;
	}

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

	.selectFieldColor {
		background-color: #33333d;
	}
</style>
