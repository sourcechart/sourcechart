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
	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { hexToBuffer } from '$lib/io/HexOps';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

	import { ChevronDownSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	let isDropdownOpen = false; // <-- Add this line to track dropdown state

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

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};
</script>

<div class="relative group" on:click={toggleDropdown} on:keypress={null}>
	<button class="bg-gray-200 px-3 py-2 rounded text-black hover:bg-gray-300">
		<span>{selectedDataset}</span>
		<ChevronDownSolid class="w-3 h-3 text-white dark:text-white" />
	</button>
	<div
		class={`scrollBarDiv
			absolute w-full mt-2 bg-white border
			border-gray-200 rounded shadow-lg
    		transform transition-transform origin-top h-48 overflow-y-auto overflow-x-hidden
    		${isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
	>
		{#each $datasets as dataset}
			{#if dataset !== null}
				<button
					class="block w-full text-left px-3 py-2 dark:text-black hover:bg-gray-200"
					on:click={() => selectFile(dataset)}
				>
					{dataset}
				</button>
			{/if}
		{/each}
	</div>
</div>
