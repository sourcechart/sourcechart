<script lang="ts">
	import { Fileupload, Listgroup } from 'flowbite-svelte';
	import { DuckDBClient } from '$lib/io/DuckDBCLI';
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore } from '$lib/io/Stores';

	let files: ListGroupItemType | null = null;

	const createFileStore = (
		filename: string,
		cols: Array<any>,
		fileSize: number,
		dataID: string,
		database: DuckDBClient
	) => {
		let tableColumnsSize: fileUpload = {
			filename: filename,
			columns: cols,
			datasetID: dataID,
			size: fileSize,
			database: database
		};
		$fileUploadStore = [...$fileUploadStore, tableColumnsSize];
	};

	const uploadFiles = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		let f: File = (target.files as FileList)[0];
		const conn = await DuckDBClient.of([f]);
		console.log(conn);
		const resp = await conn.query(`SELECT * FROM "${f.name}"`);
		var id = generateID();
		var columns = resp.schema.map((item) => item['name']);
		//@ts-ignore
		createFileStore(f.name, columns, f.size, id, conn);
	};
</script>

<Fileupload id="multiple_files" multiple on:change={uploadFiles} />
<Listgroup {files} class="mt-2" />
