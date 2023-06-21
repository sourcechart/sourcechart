<script lang="ts">
	import { Fileupload, Label, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { DuckDBClient } from '$lib/io/DuckDBCLI';
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore } from '$lib/io/Stores';

	let files: ListGroupItemType | null;

	function createFileStore(
		filename: string,
		cols: Array<any>,
		fileSize: number,
		dataID: string,
		database: DuckDBClient
	) {
		let tableColumnsSize: fileUpload = {
			filename: filename,
			columns: cols,
			datasetID: dataID,
			size: fileSize,
			database: database
		};
		$fileUploadStore = [...$fileUploadStore, tableColumnsSize];
	}

	const uploadFiles = async (e: Event) => {
		let target = e.target as HTMLInputElement;
		let f: File = (target.files as FileList)[0];
		const db = await DuckDBClient.of([f]);

		const resp = await db.query(`SELECT * FROM "${f.name}"`);
		var id = generateID(); //@ts-ignore
		var columns = resp.schema.map((item) => item['name']);
		createFileStore(f.name, columns, f.size, id, db);
	};
</script>

<Label class="pb-2" for="multiple_files">Upload multiple files</Label>
<Fileupload id="multiple_files" multiple bind:files on:change={uploadFiles} />
<Listgroup {files} let:item class="mt-2">
	{#if item}
		{item.name}
	{:else}
		<ListgroupItem>No files</ListgroupItem>
	{/if}
</Listgroup>
