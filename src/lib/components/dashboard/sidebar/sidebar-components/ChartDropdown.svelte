<script lang="ts">
	//@ts-ignore
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	type SideBarVersion = 'WorkFlow' | 'LowCode';
	export let sideBarVersion: SideBarVersion;
	import Tags from '$lib/components/ui/tags/Tags.svelte';

	let tags: string[] = [];
	let chosenPlot: string = 'Bar Chart (Default)';
	let isChartDropdownOpen: boolean = false;
	let rectangleCharts: any[] = [
		{
			chartType: 'Bar'
		},
		{
			chartType: 'Scatter'
		},
		{
			chartType: 'Pie'
		},
		{
			chartType: 'Line'
		},
		{
			chartType: 'Area'
		}
	];

	if (sideBarVersion === 'WorkFlow') {
		rectangleCharts = [...rectangleCharts, { chartType: 'Density' }];
	}

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	$: i = clickedChartIndex();

	$: {
		if ($allCharts[$i]?.chartOptions?.series[0]?.type) {
			chosenPlot = capitalizeFirstLetter($allCharts[$i].chartOptions.series[0].type);
		} else {
			chosenPlot = 'Bar Chart (Default)';
		}
	}

	const chooseChart = (plot: string) => {
		if (chosenPlot === plot) {
			chosenPlot = 'Bar Chart (Default)';
			allCharts.update((charts) => {
				charts.splice($i, 1);
				return charts;
			});
		} else {
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
		}
	};

	const removeTag = (tag: string) => {
		tags = tags.filter((item) => item !== tag);
		chooseChart(tag);
	};

	const addChartToTags = (chart: string) => {
		if (tags.includes(chart)) {
			tags = tags.filter((item) => item !== chart);
		} else {
			tags = [...tags, chart];
		}
		chooseChart(chart); // Updated function call
	};

	const closeChartDropdown = () => {
		isChartDropdownOpen = false;
	};

	const toggleChartDropdown = () => {
		isChartDropdownOpen = !isChartDropdownOpen;
	};
</script>

<div class="w-full p-4 rounded-sm relative selectFieldColor">
	<button
		class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
		on:click={toggleChartDropdown}
	>
		<span class="text-sm ml-2"> Chart Types </span>
	</button>

	{#if isChartDropdownOpen}
		<button
			class="scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border rounded shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 h-48"
			on:click|stopPropagation={closeChartDropdown}
		>
			{#each rectangleCharts as { chartType }, i (i)}
				<button
					class="block w-full text-left px-3 py-2 hover:bg-gray-200"
					on:click={() => {
						addChartToTags(chartType);
					}}
				>
					{chartType}
				</button>
			{/each}
		</button>
	{/if}
	<div class="mt-4 flex-grow">
		<span class="text-sm"> Selected Charts </span>
		<Tags items={tags} removeItem={removeTag} />
	</div>
</div>

<style>
	.selectFieldColor {
		background-color: #33333d;
	}
</style>
