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
	//@ts-expect-error
	import Tags from 'svelte-tags-input';

	let tags: Array<string> = [];
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
		let chart: Chart = $allCharts[$i];
		console.log(filename);
		chart.filename = filename;
		$chosenFile = filename;
		if ($file?.database && $file?.datasetID) {
			chart.datasetID = $file.datasetID;
			chart.database = $file.database;
			tags = [filename];
		}
		$allCharts[$i] = chart;
	}
</script>

<Button color="alternative">Choose Dataset</Button>
<Dropdown>
	{#each $datasets as dataset}
		<DropdownItem on:click={() => selectFile(dataset)}>{dataset}</DropdownItem>
	{/each}
</Dropdown>
<Tags {tags} maxTags={1} />
