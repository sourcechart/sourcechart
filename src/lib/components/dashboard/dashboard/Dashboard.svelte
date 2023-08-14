<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/ui/draw/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import { DarkMode } from '$lib/components/ui';
	import { onMount } from 'svelte';
	import { allCharts } from '$lib/io/Stores';

	let syncWorker: Worker | undefined = undefined;

	const loadDataFromSQLITE = (chart: Chart) => {
		if (syncWorker) {
			syncWorker.postMessage({
				message: 'query',
				filename: chart.filename
			});
		}
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

<!-- Center this on the screen-->
<div class="flex justify-center items-center mt-3 z-30">
	<DarkMode />
	<NavBar />
</div>
<div class="fixed z-30 ml-1">
	<Sidebar />
</div>

<Canvas />
