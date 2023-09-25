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

	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
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

			allCharts.update((charts) => {
				let chart = charts[$i];
				chart.filename = filename;
				if ($file?.datasetID) chart.datasetID = $file.datasetID;
				return charts;
			});
		}
	};

	const removeFileFromSqlite = (filename: string) => {
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

<div class="w-full p-4 rounded-sm relative">
	<div class="flex justify-between items-center">
		<button
			bind:this={dropdownContainer}
			class="bg-neutral-900/80 w-full rounded-sm hover:bg-neutral-900/50 flex-grow flex items-center"
			on:click={toggleDropdown}
		>
			<span class="text-sm text-white font-thin justify-center flex hover:text-neutral-200 ml-2">
				{selectedDataset}
			</span>
		</button>

		{#if isDropdownOpen}
			<button
				class="scrollBarDiv bg-neutral-900 absolute top-0 left-0 mt-5 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
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
</div>

<style>
	.selectFieldColor {
		background-color: #27272a00;
	}
</style>
