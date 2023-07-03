<script lang="ts">
	import {
		chosenFile,
		getFileFromStore,
		fileDropdown,
		allCharts,
		clickedChartIndex
	} from '$lib/io/Stores';
	import { Dropdown, DropdownItem, Button } from 'flowbite-svelte';
	let selectedDataset = 'Choose Dataset';

	$: file = getFileFromStore();
	$: i = clickedChartIndex();
	$: datasets = fileDropdown();

	const selectFile = (filename: string) => {
		selectedDataset = filename;
		$chosenFile = filename;
		console.log($allCharts);
		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.filename = filename;
			if ($file?.database && $file?.datasetID) {
				chart.datasetID = $file.datasetID;
				chart.database = $file.database;
			}

			return charts;
		});
	};

	const removeItem = (item: string) => {
		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.groupbyColumns = chart.groupbyColumns.filter(
				(groupbyColumn: string) => groupbyColumn !== item
			);
			return charts;
		});
	};
</script>

<Button color="alternative">{selectedDataset}</Button>
<Dropdown>
	{#each $datasets as dataset}
		<DropdownItem on:click={() => selectFile(dataset)}>{dataset}</DropdownItem>
	{/each}
</Dropdown>
