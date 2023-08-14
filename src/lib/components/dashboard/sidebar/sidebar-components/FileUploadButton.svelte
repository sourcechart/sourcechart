<script lang="ts">
	import { Fileupload, Listgroup } from 'flowbite-svelte';
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore } from '$lib/io/Stores';
	import { bufferToHex } from '$lib/io/HexOps';
	import { onMount } from 'svelte';
	import { Button } from 'flowbite-svelte';

	let syncWorker: Worker | undefined = undefined;
	let files: ListGroupItemType | null = null;
	interface ListGroupItemType {
		current?: boolean;
		disabled?: boolean;
		href?: string;
		[propName: string]: any;
	}

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	const createFileStore = (filename: string, fileSize: number, dataID: string) => {
		var tableColumnsSize = {
			filename: filename,
			datasetID: dataID,
			size: fileSize,
			fileextension: filename.split('.').pop()
		};
		fileUploadStore.update((files) => [...files, tableColumnsSize]);
	};

	const uploadFiles = async (e: Event) => {
		var target = e.target as HTMLInputElement;
		var f = (target.files as FileList)[0];
		var arrayBuffer = await f.arrayBuffer();
		var id = generateID();
		var hex = bufferToHex(arrayBuffer);

		createFileStore(f.name, f.size, id);
		if (syncWorker) {
			syncWorker.postMessage({
				filename: f.name,
				size: f.size,
				id: id,
				message: 'initialize',
				hexadecimal: hex,
				fileextension: f.name.split('.').pop()
			});
		}
	};

	onMount(loadWorker);
</script>

<Button color="dark">
	<div class="flex justify-between space-x-2">
		<svg
			class="text-gray-800 dark:text-white"
			x="0px"
			y="0px"
			width="18"
			height="18"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 18"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 1v16M1 9h16"
			/>
		</svg>
		<p>Add Data</p>
	</div>
</Button>

<Fileupload id="multiple_files" multiple on:change={uploadFiles} />
<Listgroup {files} class="mt-2" />
