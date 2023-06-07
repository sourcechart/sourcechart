<!-- Point of Entry for reactivity-->

<script lang="ts">
	import { NavLi, NavUl } from 'flowbite-svelte';
	import { EChartBuilder, ChartOptions } from '$lib/io/eChartBuilder';
	import { generateID } from '$lib/io/fileUtils';
	import { allCharts, newChartID } from '$lib/io/stores';
	import FileUpload from '$lib/components/dashboard/fileupload/FileUpload.svelte';

	function addEChartPropsToStore(chart: string) {
		var echart = new EChartBuilder(chart);
		var eChartDataset = echart.getOptions();
		var id = generateID();
		$newChartID = id;
		var data = addMetadataToChart(eChartDataset, id, chart); //@ts-ignore
		$allCharts = [...$allCharts, data];
	}

	function addMetadataToChart(eChartDataset: object, id: string, chart: string) {
		let chartMetaData = {
			filename: null,
			chartID: id,
			datasetID: null,
			chartType: chart,
			colors: null,
			filters: [],
			groupbyColumns: [],
			aggregator: null,
			xColumn: null,
			yColumn: null,
			columns: [],
			chartOptions: eChartDataset
		};
		return chartMetaData;
	}

	const addBarPlot = () => addEChartPropsToStore(ChartOptions.bar);
	const addScatterPlot = () => addEChartPropsToStore(ChartOptions.scatter);
	const addPiePlot = () => addEChartPropsToStore(ChartOptions.pi);
	const addLinePlot = () => addEChartPropsToStore(ChartOptions.line);
	const addAreaPlot = () => addEChartPropsToStore(ChartOptions.area);
</script>

<NavUl hidden={true}>
	<NavLi on:click={addBarPlot}>
		<svelte:fragment>
			Bar Plot
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
				/>
			</svg>
		</svelte:fragment>
	</NavLi>
	<NavLi on:click={addAreaPlot}>
		<svelte:fragment>
			Area Plot
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
				/>
			</svg>
		</svelte:fragment>
	</NavLi>
	<NavLi on:click={addScatterPlot}>
		<svelte:fragment>
			Scatter Plot
			<svg
				class="h-8 w-8"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" /> <circle cx="7" cy="17" r="1" />
				<circle cx="12" cy="12" r="1" /> <circle cx="17" cy="7" r="1" /></svg
			>
		</svelte:fragment>
	</NavLi>
	<NavLi on:click={addLinePlot}>
		<svelte:fragment>
			Line Plot
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
				/>
			</svg>
		</svelte:fragment>
	</NavLi>
	<NavLi on:click={addPiePlot}>
		<svelte:fragment>
			Pie Plot
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
				/>
			</svg>
		</svelte:fragment>
	</NavLi>
	<NavLi>
		<svelte:component this={FileUpload} />
	</NavLi>
</NavUl>