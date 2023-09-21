<script lang="ts">
	//@ts-ignore
	import Spinner from 'flowbite-svelte/Spinner.svelte'; //@ts-ignore
	import Dropzone from 'flowbite-svelte/Dropzone.svelte';
	import { generateID } from '$lib/io/GenerateID';
	import { createFileStore, activeDropZone, activeSidebar } from '$lib/io/Stores';
	import { bufferToHex } from '$lib/io/HexOps';
	import { onMount } from 'svelte';
	import { DuckDBClient } from '$lib/io/DuckDBClient';

	let isLoading = false;
	let value: string[] = [];
	let syncWorker: Worker | undefined = undefined;

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	const uploadToSQLITe = async (file: File) => {
		isLoading = true; // start the loading process
		try {
			var arrayBuffer = await file.arrayBuffer();
			var id = generateID();
			var hex = bufferToHex(arrayBuffer);

			createFileStore(file.name, file.size, id);
			if (syncWorker) {
				syncWorker.postMessage({
					filename: file.name,
					size: file.size,
					id: id,
					message: 'initialize',
					hexadecimal: hex,
					fileextension: file.name.split('.').pop()
				});
			}
		} catch (error) {
			console.error('Error uploading to SQLite:', error);
		} finally {
			isLoading = false; // end the loading process
		}
	};

	//This is used for Drag and Drop Events
	const dropHandle = (event: DragEvent) => {
		value = [];
		event.preventDefault();
		if (event.dataTransfer?.items) {
			[...event.dataTransfer.items].forEach((item) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					if (file) {
						value.push(file.name);
						uploadToSQLITe(file);
					}
				}
				activeDropZone.set(false);
				activeSidebar.set(true);
			});
		} else if (event.dataTransfer) {
			[...event.dataTransfer.files].forEach((file) => {
				value.push(file.name);
				uploadToSQLITe(file);
			});
			activeDropZone.set(false);
			activeSidebar.set(true);
		}
	};

	const handleChange = (event: Event) => {
		const inputElement = event.target as HTMLInputElement;
		const files = inputElement.files;
		if (files && files.length > 0) {
			value.push(files[0].name);
			[...files].forEach((file) => {
				uploadToSQLITe(file);
			});
			activeDropZone.set(false);
			activeSidebar.set(true);
		}
	};

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
	onMount(loadWorker);
</script>

<Dropzone
	defaultClass="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed  selectFieldColor cursor-pointer dark:hover:bg-bray-800  hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600
"
	id="dropzone"
	on:drop={dropHandle}
	on:dragover={dragOver}
	on:change={handleChange}
>
	{#if isLoading}
		<div class="loading-container flex">
			<span class="mr-2">Loading...</span>
			<Spinner size={40} />
		</div>
	{:else}
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
	{/if}
</Dropzone>

<style>
	.loading-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
