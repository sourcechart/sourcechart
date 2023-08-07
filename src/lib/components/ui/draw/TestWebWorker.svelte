<script lang="ts">
	import { onMount } from 'svelte';

	let syncWorker: Worker | undefined = undefined;

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
		syncWorker.postMessage({});

		console.log('syncWorker', syncWorker);
	};

	onMount(loadWorker);
</script>
