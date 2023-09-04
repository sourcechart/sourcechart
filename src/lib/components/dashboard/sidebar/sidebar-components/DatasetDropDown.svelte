<script lang="ts">
	import {
		chosenFile,
		getFileFromStore,
		fileDropdown,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';

	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte'; //@ts-ignore
	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { hexToBuffer } from '$lib/io/HexOps';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

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
		var arrayBuffer = hexToBuffer(e.data.hexadecimal);
		var dataObject = {
			buffer: arrayBuffer,
			filename: e.data.filename
		};
		queryDuckDB(dataObject);
	};

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	const queryDuckDB = async (dataObject: DataObject) => {
		const db = await DuckDBClient.of([dataObject]);
		var filename = checkNameForSpacesAndHyphens(dataObject.filename);
		const resp = await db.query(`SELECT * FROM ${filename} LIMIT 0`); //@ts-ignore
		var columns = resp.schema.map((item) => item['name']);

		duckDBInstanceStore.set(db);

		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.columns = columns;
			return charts;
		});
	};

	const selectFile = (filename: string | null) => {
		if (filename) {
			selectedDataset = filename;
			$chosenFile = filename;

			if (syncWorker) {
				syncWorker.postMessage({
					message: 'query',
					filename: filename
				});
				syncWorker.onmessage = onWorkerMessage;
			}

			allCharts.update((charts) => {
				let chart = charts[$i];
				chart.filename = filename;
				if ($file?.datasetID) chart.datasetID = $file.datasetID;
				return charts;
			});
		}
	};

	onMount(loadWorker);
</script>

<Button outline color="light">{selectedDataset}</Button>
<Dropdown class="overflow-y-auto py-1 h-48">
	{#each $datasets as dataset}
		{#if dataset !== null}
			<DropdownItem on:click={() => selectFile(dataset)}>{dataset}</DropdownItem>
		{/if}
	{/each}
</Dropdown>
