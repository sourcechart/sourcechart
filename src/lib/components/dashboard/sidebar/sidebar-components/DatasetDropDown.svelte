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
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { onDestroy } from 'svelte';

	let isDropdownOpen = false;
	let selectedDataset: string | null = 'Choose Dataset';
	let dropdownContainer: HTMLElement;

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

	const handleOutsideClick = (event: MouseEvent) => {
		if (dropdownContainer && !dropdownContainer.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	};

	const queryDuckDB = async (filename: string) => {
		const dataObject = $fileUploadStore.find((file) => file.filename === filename);
		if (!dataObject) return;
		const db = await DuckDBClient.of([dataObject.file]);
		const sanitizedFilename = checkNameForSpacesAndHyphens(dataObject.file.name);
		const resp = await db.query(`SELECT * FROM ${sanitizedFilename} LIMIT 0`); //@ts-ignore
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

	const selectFile = (filename: string) => {
		selectedDataset = filename;
		$chosenFile = filename;

		allCharts.update((charts) => {
			charts[$i].filename = filename;
			if ($file?.datasetID) charts[$i].datasetID = $file.datasetID;
			return charts;
		});

		queryDuckDB(filename);
	};

	const removeFromAllCharts = (filename: string) => {
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
</script>

<div class="w-full p-4 rounded-sm relative selectFieldColor">
	<div class="flex justify-between items-center">
		<button
			bind:this={dropdownContainer}
			class="bg-gray-200 w-full rounded-sm hover:bg-gray-300 flex-grow flex items-center"
			on:click={toggleDropdown}
		>
			<span class="text-sm ml-2">
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
								removeFromAllCharts(dataset);
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
