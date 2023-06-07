<script lang="ts">
	import { DuckDBClient } from '$lib/io/duckdbcli';
	import { generateID } from '$lib/io/fileUtils';
	import { fileUploadStore } from '$lib/io/stores';
	import type { AsyncDuckDB } from '@duckdb/duckdb-wasm';

	//@ts-ignore
	let fileinput: { click };
	type fileUpload = {
		filename: string;
		columns: Array<null | string>;
		size: number;
		datasetID: string;
		database: AsyncDuckDB;
	};

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
			size: fileSize, //@ts-ignore
			database: database
		}; //@ts-ignore
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

<div id="app">
	<h1>Upload File</h1>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
			on:click={() => {
				fileinput.click();
			}}
		/>
	</svg>

	<div
		class="chan"
		on:click={() => {
			fileinput.click();
		}}
	/>
	<input
		style="display:none"
		type="file"
		accept=".csv, .parquet, .txt, .json"
		on:change={(e) => uploadFiles(e)}
		bind:this={fileinput}
	/>
</div>

<style>
	#app {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-flow: column;
	}
</style>
