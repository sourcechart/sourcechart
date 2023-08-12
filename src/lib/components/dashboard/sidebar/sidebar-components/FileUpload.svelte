<script lang="ts">
	import { Fileupload, Listgroup } from 'flowbite-svelte';
	import { DuckDBClient } from '$lib/io/DuckDBCLI';
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore } from '$lib/io/Stores';
	import { onMount } from 'svelte';

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

	const createFileStore = (
		filename: string,
		cols: any[],
		fileSize: number,
		dataID: string,
		database: DuckDBClient
	) => {
		let tableColumnsSize: FileUpload = {
			filename: filename,
			columns: cols,
			datasetID: dataID,
			size: fileSize,
			database: database
		};
		$fileUploadStore = [...$fileUploadStore, tableColumnsSize];
	};

	const bufferToHex = (buffer: ArrayBufferLike) => {
		// buffer is an ArrayBuffer
		return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
	};

	const uploadFiles = async (e: Event) => {
		var target = e.target as HTMLInputElement;
		var f = (target.files as FileList)[0];
		var arrayBuffer = await f.arrayBuffer();
		const conn = await DuckDBClient.of([f]);
		const resp = await conn.query(`SELECT * FROM "${f.name}"`);
		var id = generateID();
		var hex = bufferToHex(arrayBuffer); //@ts-ignore
		var columns = resp.schema.map((item) => item['name']);
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
