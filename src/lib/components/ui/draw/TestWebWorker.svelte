<script lang="ts">
	import { onMount } from 'svelte';

	let syncWorker: Worker | undefined = undefined;

	const onWorkerMessage = () => {
		console.log('Cool it works out 😃');
	};

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
		syncWorker.postMessage({ command: 'initialize' });
		syncWorker.onmessage = onWorkerMessage;

		console.log('syncWorker', syncWorker);
	};

	onMount(loadWorker);
</script>
