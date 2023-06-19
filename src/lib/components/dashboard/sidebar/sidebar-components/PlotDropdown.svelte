<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { EChartBuilder, ChartOptions } from '$lib/io/eChartBuilder';
	import { generateID } from '$lib/io/fileUtils';
	import { allCharts, newChartID } from '$lib/io/stores';

	const addBarPlot = () => addEChartPropsToStore(ChartOptions.bar);
	const addScatterPlot = () => addEChartPropsToStore(ChartOptions.scatter);
	const addPiePlot = () => addEChartPropsToStore(ChartOptions.pi);
	const addLinePlot = () => addEChartPropsToStore(ChartOptions.line);
	const addAreaPlot = () => addEChartPropsToStore(ChartOptions.area);
</script>

<Button color="alternative" pill={false} outline={false}>{chosenComponent}</Button>
