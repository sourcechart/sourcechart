<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { createFileStore } from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';
	import { bufferToHex } from '$lib/io/HexOps';

	export let Dataset: ExternalDataset;

	let syncWorker: Worker | undefined = undefined;

	const addURLToDatabase = async () => {
		const response = await fetch(Dataset.url);
		var buffer = await response.arrayBuffer();
		uploadToSQLITE(buffer);
	};

	const uploadToSQLITE = async (arrayBuffer: ArrayBuffer) => {
		var id = generateID();
		var hex = bufferToHex(arrayBuffer);

		createFileStore(Dataset.name, arrayBuffer.byteLength, id);
		if (syncWorker) {
			syncWorker.postMessage({
				filename: Dataset.name,
				size: arrayBuffer.byteLength,
				id: id,
				message: 'initialize',
				hexadecimal: hex,
				fileextension: Dataset.url.split('.').pop()
			});
		}
	};
</script>

<Button pill={false} outline color="light" on:click={addURLToDatabase} />
