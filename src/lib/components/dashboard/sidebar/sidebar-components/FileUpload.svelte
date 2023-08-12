<script lang="ts">
	import { Fileupload, Listgroup } from 'flowbite-svelte';
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore } from '$lib/io/Stores';
	import { bufferToHex } from '$lib/io/HexOps';
	import { onMount } from 'svelte';

	interface ListGroupItemType {
		current?: boolean;
		disabled?: boolean;
		href?: string;
		[propName: string]: any;
	}

	let syncWorker: Worker | undefined = undefined;

	const onWorkerMessage = (e: any) => {
		console.log(e.data);
	};

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	onMount(loadWorker);

	let files: ListGroupItemType | null = null;

	const createFileStore = (filename: string, cols: any[], fileSize: number, dataID: string) => {
		let tableColumnsSize: FileUpload = {
			filename: filename,
			columns: cols,
			datasetID: dataID,
			size: fileSize
		};
		$fileUploadStore = [...$fileUploadStore, tableColumnsSize];
	};

	const uploadFiles = async (e: Event) => {
		var target = e.target as HTMLInputElement;
		var f = (target.files as FileList)[0];
		var arrayBuffer = await f.arrayBuffer();

		var id = generateID();
		var hex = bufferToHex(arrayBuffer); //@ts-ignore

		//@ts-ignore
		createFileStore(f.name, columns, f.size, id, conn);

		if (syncWorker) {
			syncWorker.postMessage({
				filename: f.name,
				size: f.size,
				id: id,
				message: 'initialize',
				hexadecimal: hex
			});
			syncWorker.onmessage = onWorkerMessage;
		}
	};
</script>

<Fileupload id="multiple_files" multiple on:change={uploadFiles} />
<Listgroup {files} class="mt-2" />
