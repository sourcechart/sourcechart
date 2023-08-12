<script lang="ts">
	import {
		chosenFile,
		getFileFromStore,
		fileDropdown,
		allCharts,
		clickedChartIndex
	} from '$lib/io/Stores';
	import { Dropdown, DropdownItem, Button, P } from 'flowbite-svelte';
	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { onMount } from 'svelte';

	let syncWorker: Worker | undefined = undefined;
	let selectedDataset: string | null = 'Choose Dataset';

	$: if ($allCharts.length > 0 && $allCharts[$i]) {
		selectedDataset = $allCharts[$i]?.filename ? $allCharts[$i].filename : 'Choose Dataset';
		$chosenFile = $allCharts[$i]?.filename ? $allCharts[$i].filename : '';
	}

	$: file = getFileFromStore();
	$: i = clickedChartIndex();
	$: datasets = fileDropdown();

	const onWorkerMessage = (e: MessageEvent) => {
		console.log(e.data);
	};

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	onMount(loadWorker);

	const selectFile = (filename: string) => {
		selectedDataset = filename;
		$chosenFile = filename;
		if (syncWorker) {
			syncWorker.postMessage({
				message: 'query',
				file: $file
			});
			syncWorker.onmessage = onWorkerMessage;
		}
		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.filename = filename;
			if ($file?.datasetID) chart.datasetID = $file.datasetID;
			return charts;
		});
	};

	/*
	const removeItem = (item: string) => {
		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.groupbyColumns = chart.groupbyColumns.filter(
				(groupbyColumn: string) => groupbyColumn !== item
			);
			return charts;
		});
	};
	*/
</script>

<Button color="alternative">{selectedDataset}</Button>
<Dropdown>
	{#each $datasets as dataset}
		<DropdownItem on:click={() => selectFile(dataset)}>{dataset}</DropdownItem>
	{/each}
</Dropdown>
