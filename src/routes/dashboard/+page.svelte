<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/dashboard/canvas/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import FileUploadPanel from '$lib/components/dashboard/fileuploadpanel/FileUploadPanel.svelte';
	import { onMount } from 'svelte';

	import { allCharts, clickedChartIndex, activeDropZone, keyPress } from '$lib/io/Stores';
	import { hexToBuffer } from '$lib/io/HexOps';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { duckDBInstanceStore } from '$lib/io/Stores';
	import { DuckDBClient } from '$lib/io/DuckDBClient';
	import { setLocalStorage } from '$lib/io/Storage';

	//export let data;

	setLocalStorage('color-theme', 'dark');

	let syncWorker: Worker | undefined = undefined;
	$: i = clickedChartIndex();

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

	const loadPreviousState = async () => {
		if ($allCharts.length === 0) return;

		for (const chart of $allCharts) {
			break; //queryWorker(chart);
		}
	};

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			activeDropZone.set(false);
		} else if (['0', '1', '2', '3'].includes(event.key)) {
			keyPress.set(event.key);
		}
	}

	onMount(() => {
		loadPreviousState();
		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	});
</script>

<div class="no-scroll">
	<div class="flex justify-center items-center fixed top-4 left-1/2 -translate-x-1/2 z-30">
		<NavBar />
	</div>
	<div class="absolute z-30 ml-6 mt-6">
		<Sidebar />
	</div>
	<div class="relative">
		{#if $activeDropZone}
			<div class="z-30 absolute inset-0 flex justify-center items-center w-screen h-screen">
				<FileUploadPanel />
			</div>
		{/if}
		<div class="z-0 relative w-screen h-screen">
			<Canvas />
		</div>
	</div>
</div>

<style>
	.no-scroll {
		widows: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
