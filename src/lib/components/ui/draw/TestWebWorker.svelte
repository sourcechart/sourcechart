<script lang="ts">
	import { onMount } from 'svelte';

	let syncWorker: Worker | undefined = undefined;

	const onWorkerMessage = (e) => {
		console.log(e.data);
	};

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
		syncWorker.postMessage({ message: 'initialize' });
		syncWorker.onmessage = onWorkerMessage;
		syncWorker.postMessage({ message: 'query' });
	};

	onMount(loadWorker);
</script>
