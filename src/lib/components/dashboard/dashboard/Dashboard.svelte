<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/ui/draw/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import DropZone from '$lib/components/dashboard/dropzone/DropZone.svelte';

	import { DarkMode } from '$lib/components/ui';
	import { onMount } from 'svelte';
	import { allCharts, clickedChartIndex, activeDropZone } from '$lib/io/Stores';
	import { hexToBuffer } from '$lib/io/HexOps';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { duckDBInstanceStore } from '$lib/io/Stores';
	import { DuckDBClient } from '$lib/io/DuckDBClient';

	let syncWorker: Worker | undefined = undefined;
	$: i = clickedChartIndex();

	const loadDataFromSQLITE = (chart: Chart) => {
		if (syncWorker) {
			syncWorker.postMessage({
				message: 'query',
				filename: chart.filename
			});
			syncWorker.onmessage = onWorkerMessage;
		}
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

	const loadPreviousState = async () => {
		await loadWorker();
		$allCharts.forEach(loadDataFromSQLITE);
	};

	onMount(loadPreviousState);
</script>

<div class="flex justify-center items-center mt-3 z-30">
	<div class="flex flex-row">
		<DarkMode />
		<NavBar />
	</div>
</div>
<div class="fixed z-30 ml-1">
	<Sidebar />
</div>

<div class="relative w-screen h-screen">
	{#if $activeDropZone}
		<div class="z-31 absolute inset-0 flex justify-center items-center">
			<DropZone />
		</div>
	{/if}
	<div class="z-0 relative">
		<Canvas />
	</div>
</div>
