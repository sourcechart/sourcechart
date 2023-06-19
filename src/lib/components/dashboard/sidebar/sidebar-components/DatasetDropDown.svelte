<script lang="ts">
	import {
		chosenFile,
		getFileFromStore,
		chartOptions,
		fileDropdown,
		clearChartOptions,
		allCharts,
		clickedChartIndex
	} from '$lib/io/stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	import { Tags } from '$lib/components/ui/tags';
	let tags: Array<string> = [];
	let selectedDataset = 'Choose Dataset';

	$: file = getFileFromStore();
	$: drawerOptions = chartOptions();
	$: i = clickedChartIndex();
	$: datasets = fileDropdown();

	$: if ($clearChartOptions && $allCharts[$i]?.filename) {
		tags = [];
		let chart: Chart = $allCharts[$i]; //We are be able to refactor this to a derived store.
		chart.filename = null;
		$allCharts[$i] = chart;
	}

	$: if ($drawerOptions.filename && tags.length == 0) {
		tags = [];
		tags = [$drawerOptions.filename];
	}

	function selectFile(filename: string) {
		let chart = $allCharts[$i];
		console.log(chart);
		selectedDataset = filename;
		$chosenFile = filename;
		chart.filename = filename;

		if ($file?.database && $file?.datasetID) {
			chart.datasetID = $file.datasetID;
			chart.database = $file.database;
			tags = [filename];
		}
		$allCharts[$i] = chart;
	}

	function removeItem(item: string) {
		tags = tags.filter((tag) => tag !== item);
		let chart = $allCharts[$i];
		chart.groupbyColumns = tags;
		$allCharts[$i] = chart;
	}
</script>

<Button color="alternative">{selectedDataset}</Button>
<Dropdown>
	{#each $datasets as dataset}
		<DropdownItem on:click={() => selectFile(dataset)}>{dataset}</DropdownItem>
	{/each}
</Dropdown>
