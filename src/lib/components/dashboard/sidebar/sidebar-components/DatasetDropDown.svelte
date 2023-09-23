<script lang="ts">
	import {
		chosenFile,
		getFileFromStore,
		fileDropdown,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore,
		fileUploadStore
	} from '$lib/io/Stores';

	import { CloseSolid } from 'flowbite-svelte-icons';

	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { hexToBuffer } from '$lib/io/HexOps';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { onMount, onDestroy } from 'svelte';

	let isDropdownOpen = false;
	let syncWorker: Worker | undefined = undefined;
	let selectedDataset: string | null = 'Choose Dataset';
	let dropdownContainer: HTMLElement;

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	};

	$: {
		if (isDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

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
		var schema = resp.schema; //@ts-ignore
		var columns = schema.map((item) => item['name']);

		duckDBInstanceStore.set(db);

		allCharts.update((charts) => {
			let chart = charts[$i];
			chart.schema = schema;
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

	const removeFileFromSqlite = (filename: string) => {
		if (syncWorker) {
			syncWorker.postMessage({
				message: 'delete',
				filename: filename
			});
			syncWorker.onmessage = onWorkerMessage;
			console.log('file deleted from sqlite');
		}

		allCharts.update((charts) => {
			return charts.filter((chart) => chart.filename !== filename);
		});

		fileUploadStore.update((file) => {
			return file.filter((file) => file.filename !== filename);
		});
	};

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});

	onMount(loadWorker);
</script>

<div class="w-full p-4 rounded-sm relative bg-neutral-900">
	<div class="flex justify-between items-center">
		<button
			bind:this={dropdownContainer}
			class="bg-black/50 w-full bg-gray-200 rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={toggleDropdown}
		>
			<span class="text-sm ml-2 text-slate-600">
				{selectedDataset}
			</span>
		</button>
	</div>
	{#if isDropdownOpen}
		<button
			class={`
            scrollBarDiv bg-gray-900 absolute top-full w-full mt-2 border
            rounded shadow-lg transform transition-transform 
            origin-top overflow-y-auto overflow-x-hidden z-10 
            ${isDropdownOpen ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
			on:click={() => (isDropdownOpen = false)}
		>
			{#each $datasets as dataset}
				{#if dataset !== null}
					<div class="flex justify-between items-center text-gray-400 relative selectFieldColor">
						<div
							class="text-left px-3 py-2 w-full bg-gray-900 dark:text-black hover:bg-gray-700 cursor-pointer truncate pr-8"
							on:click={() => {
								selectFile(dataset);
								isDropdownOpen = false;
							}}
							on:keypress={(event) => {
								if (event.key === 'Enter') {
									selectFile(dataset);
									isDropdownOpen = false;
								}
							}}
						>
							{dataset}
						</div>
						<button
							class="absolute right-0 top-50 transform -translate-y-50 p-2 bg-transparent"
							on:click={(event) => {
								event.stopPropagation();
								removeFileFromSqlite(dataset);
							}}
						>
							<CloseSolid class="w-3 h-3 text-white dark:text-white" />
						</button>
					</div>
				{/if}
			{/each}
		</button>
	{/if}
</div>

<style>
	.selectFieldColor {
		background-color: #33333d;
	}
</style>
