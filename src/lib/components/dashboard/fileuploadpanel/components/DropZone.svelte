<script lang="ts">
	import { generateID } from '$lib/io/GenerateID';
	import { fileUploadStore, activeDropZone, activeSidebar } from '$lib/io/Stores';
	import { set } from 'idb-keyval';

	let isLoading = false;
	let value: string[] = [];

	const insertFileHandle = async (file: File) => {
		isLoading = true;
		var tableColumnsSize = {
			filename: file.name,
			file: file,
			datasetID: generateID(),
			size: file.size,
			fileExtension: file.name.split('.').pop()
		};
		fileUploadStore.update((fileUploadStore) => [...fileUploadStore, tableColumnsSize]);
		await set(file.name, file);
	};

	const selectFile = async () => {
		try {
			const [fileHandle] = await window.showOpenFilePicker();
			const file = await fileHandle.getFile();
			value.push(file.name);
			insertFileHandle(file);
		} catch (err) {
			console.error('Error accessing file:', err);
		}
	};

	const dropHandle = (event: DragEvent) => {
		value = [];
		event.preventDefault();
		if (event.dataTransfer?.items) {
			[...event.dataTransfer.items].forEach((item) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file) {
						value.push(file.name);
						insertFileHandle(file);
					}
				}
				activeDropZone.set(false);
				activeSidebar.set(true);
			});
		} else if (event.dataTransfer) {
			[...event.dataTransfer.files].forEach((file) => {
				value.push(file.name);
			});
			activeDropZone.set(false);
			activeSidebar.set(true);
		}
	};

	/*
	const handleChange = async (event: Event) => {
		const inputElement = event.target as HTMLInputElement;
		const files = inputElement.files;
		if (files && files.length > 0) {
			value.push(files[0].name);
			for (let file of files) {
				insertFileHandle(file);

				// Get a handle to the file on the user's file system
				const fileHandle = await window.showOpenFilePicker();
				console.log(fileHandle);
			}
			activeDropZone.set(false);
			activeSidebar.set(true);
		}
	};*/

	const showFiles = (files: string[]): string => {
		if (files.length === 1) return files[0];
		let concat = '';
		files.map((file) => {
			concat += file;
			concat += ',';
			concat += ' ';
		});

		if (concat.length > 40) concat = concat.slice(0, 40) + '...';
		return concat;
	};

	const dragOver = (event: DragEvent) => {
		event.preventDefault();
	};
</script>

<div
	class="flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-gray-300 border-dashed selectFieldColor cursor-pointer hover:bg-neutral-600 dark:border-neutral-600 dark:hover:border-gray-500 dark:hover:bg-gray-600
"
	id="dropzone"
	on:drop={dropHandle}
	on:dragover={dragOver}
	on:click={selectFile}
	on:keypress={(event) => {
		if (event.key === 'Enter') {
			selectFile();
		}
	}}
>
	<svg
		aria-hidden="true"
		class="mb-3 w-10 h-10 text-gray-400"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		><path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
		/></svg
	>
	{#if value.length === 0}
		<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
			<span class="font-semibold">Click to upload</span> or drag and drop
		</p>
		<p class="text-xs text-gray-500 dark:text-gray-400">CSV, Parquet, Text, JSON</p>
	{:else}
		<p>{showFiles(value)}</p>
	{/if}
</div>
