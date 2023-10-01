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
	import { removeFromIndexedDB } from '$lib/io/IDBUtils';
	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { onDestroy } from 'svelte';
	import { values } from 'idb-keyval';
	import FileUploadButton from '../sidebar-components/FileUploadButton.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	import CarrotDown from '$lib/components/ui/icons/CarrotDown.svelte';

	let isDropdownOpen = false;
	let selectedDataset: string | null = '';
	let dropdownContainer: HTMLElement;

	$: file = getFileFromStore();
	$: i = clickedChartIndex();
	$: datasets = fileDropdown();

	$: if ($allCharts[$i]?.filename) {
		selectedDataset = extractFilenameFromURLOrString($allCharts[$i].filename);
	} else {
		selectedDataset = 'Select Dataset';
	}

	$: {
		if (isDropdownOpen) {
			document.addEventListener('click', handleOutsideClick);
		} else {
			document.removeEventListener('click', handleOutsideClick);
		}
	}

	function extractFilenameFromURLOrString(input: string): string {
		try {
			const path = new URL(input).pathname;
			const parts = path.split('/');
			return parts[parts.length - 1];
		} catch {
			return input;
		}
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	};

	const getFileHandleFromIDB = async (filename: string) => {
		try {
			const storedFileHandles = await values();
			const fileHandle = storedFileHandles.find((file) => file.name === filename);

			if (!fileHandle) {
				throw new Error(`No fileHandle found for filename: ${filename}`);
			}
			let permission = await fileHandle.queryPermission();

			if (permission !== 'granted') {
				permission = await fileHandle.requestPermission();
				if (permission !== 'granted') {
					return;
				}
			}
			return fileHandle;
		} catch (error) {
			console.error('Error fetching fileHandle from IDB:', error);
			throw error; // You can either re-throw the error or handle it based on your application's requirements
		}
	};

	const queryDuckDB = async (filename: string) => {
		console.log('queryDuckDB', filename);
		let resp;
		let fname = filename;

		chosenFile.set(filename);
		const dataset = $fileUploadStore.find((file) => file.filename === filename);
		if (!dataset) return;
		let db: DuckDBClient;

		if (dataset?.externalDataset?.url) {
			db = await DuckDBClient.of([]);
			resp = await db.query(`SELECT * FROM '${dataset?.externalDataset?.url}' LIMIT 0`);
			fname = `${dataset?.externalDataset?.url}`;
			selectedDataset = dataset.filename;
		} else if (dataset.filename) {
			const fileHandle = await getFileHandleFromIDB(dataset.filename);
			const file = await fileHandle.getFile();
			db = await DuckDBClient.of([file]);
			const sanitizedFilename = checkNameForSpacesAndHyphens(file.name);
			selectedDataset = dataset.filename;

			resp = await db.query(`SELECT * FROM ${sanitizedFilename} LIMIT 0`); //@ts-ignore
		} else {
			return;
		}
		//@ts-ignore
		var schema = resp.schema; //@ts-ignore
		var columns = schema.map((item) => item['name']);

		duckDBInstanceStore.set(db);
		allCharts.update((charts) => {
			let chart = charts[$i];
			if ($file?.datasetID) charts[$i].datasetID = $file.datasetID;
			charts[$i].filename = fname;
			chart.schema = schema;
			chart.columns = columns;
			return charts;
		});
	};

	const removeFromAllCharts = (filename: string) => {
		allCharts.update((charts) => {
			return charts.filter((chart) => chart.filename !== filename);
		});

		fileUploadStore.update((file) => {
			return file.filter((file) => file.filename !== filename);
		});

		removeFromIndexedDB('keyval-store', 'keyval', filename)
			.then(() => {
				console.log('Item removed!');
			})
			.catch((error) => {
				console.error('Error:', error);
			});

		selectedDataset = 'Select Dataset';
	};

	const toggleDropdown = () => {
		isDropdownOpen = !isDropdownOpen;
	};

	onDestroy(() => {
		document.removeEventListener('click', handleOutsideClick);
	});
</script>

<div class="py-1 flex w-full space-x-1 items-center justify-between">
	<span class="text-sm font-light text-neutral-300">Datasets</span>

	<div class="relative flex justify-between">
		<button
			bind:this={dropdownContainer}
			class="bg-neutral-900 justify-between text-center rounded-sm hover:bg-neutral-900/50 flex items-center border-neutral-700/50 w-44 px-1"
			on:click={toggleDropdown}
		>
			<span
				class="text-sm text-gray-100 justify-center flex hover:text-neutral-200 font-thin ml-1 truncate"
			>
				{selectedDataset || 'Select Dataset'}
			</span>
			<CarrotDown class=" hover:text-neutral-400 " />
		</button>

		{#if isDropdownOpen}
			<div
				class="scrollBarDiv absolute top-full left-0 rounded-sm bg-neutral-900 w-40 mr-3 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each $datasets as dataset}
					{#if dataset !== null}
						<div
							class="flex justify-between w-full items-center text-gray-300 relative selectFieldColor hover:bg-neutral-700"
						>
							<button
								class="flex-grow text-left text-sm px-3 py-2 cursor-pointer truncate"
								on:click={async () => queryDuckDB(dataset)}
								on:keypress={async (e) => e.key === 'Enter' && queryDuckDB(dataset)}
							>
								{dataset}
							</button>
							<button
								class="ml-2 p-2"
								on:click={(e) => {
									removeFromAllCharts(dataset);
									e.stopPropagation();
								}}
							>
								<CloseSolid class="w-4 h-4 hover:text-gray-300 text-white" />
							</button>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	</div>

	<FileUploadButton />
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px; /* Adjust this value to your desired maximum height */
		overflow-y: auto;
	}
</style>
