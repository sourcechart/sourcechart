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

	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
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
		console.log(schema);

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
						<div>
							<div
								class="flex justify-between items-center text-gray-400 relative selectFieldColor"
							>
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
</div>

<style>
	.selectFieldColor {
		background-color: #27272a00;
	}
</style>
