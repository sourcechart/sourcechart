<script lang="ts">
	import { bufferToHex } from '$lib/io/HexOps';
	import { generateID } from '$lib/io/GenerateID';
	import { onMount } from 'svelte';
	import { activeDropZone, createFileStore } from '$lib/io/Stores'; //@ts-ignore
	import Table from 'flowbite-svelte/Table.svelte'; //@ts-ignore
	import TableHead from 'flowbite-svelte/TableHead.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import TableBody from 'flowbite-svelte/TableBody.svelte'; //@ts-ignore
	import TableBodyCell from 'flowbite-svelte/TableBodyCell.svelte'; //@ts-ignore
	import TableBodyRow from 'flowbite-svelte/TableBodyRow.svelte'; //@ts-ignore
	import TableHeadCell from 'flowbite-svelte/TableHeadCell.svelte';

	let syncWorker: Worker | undefined = undefined;
	let fileextension: string | undefined = '';
	let filename: string | undefined = '';
	let size: number = 0;

	const datasets: ExternalDataset[] = [
		{
			name: 'ElectionList',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of all elections since 1950'
		},
		{
			name: 'Leader List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of all leaders since 1950'
		},
		{
			name: 'Regime List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/regime_list.csv',
			description: 'List of all regimes since 1950'
		}
	];

	const loadWorker = async () => {
		const SyncWorker = await import('$lib/io/web.worker?worker');
		syncWorker = new SyncWorker.default();
	};

	const addURLToDatabase = async (dataset: ExternalDataset) => {
		const response = await fetch(dataset.url);
		var buffer = await response.arrayBuffer();
		filename = dataset.url.split('/').pop(); //@ts-ignore
		fileextension = filename.split('.').pop();
		size = buffer.byteLength / 1000; //@ts-ignore
		uploadToSQLITE(buffer, filename, fileextension, size);
	};

	const uploadToSQLITE = async (
		arrayBuffer: ArrayBuffer,
		filename: string,
		fileextension: string,
		size: number
	) => {
		var id = generateID();
		var hex = bufferToHex(arrayBuffer);

		if (syncWorker) {
			syncWorker.postMessage({
				filename: filename,
				size: size,
				id: id,
				message: 'initialize',
				hexadecimal: hex,
				fileextension: fileextension
			});
			createFileStore(filename, size, id);

			syncWorker.onerror = (e) => {
				console.log(e);
			};
		}
		activeDropZone.set(false);
	};

	onMount(loadWorker);
</script>

<div class="w-full">
	<Table>
		<TableHead>
			<TableHeadCell>Dataset</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
			<TableHeadCell />
		</TableHead>
	</Table>
	<TableBody class="divide-y">
		{#each datasets as dataset}
			<TableBodyRow>
				<TableBodyCell>{dataset.name}</TableBodyCell>
				<TableBodyCell>{dataset.description}</TableBodyCell>
				<TableBodyCell>
					<Button pill={false} outline on:click={() => addURLToDatabase(dataset)}
						>Add Dataset</Button
					>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</div>
