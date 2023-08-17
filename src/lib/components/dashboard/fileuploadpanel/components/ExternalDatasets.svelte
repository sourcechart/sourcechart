<script lang="ts">
	import { bufferToHex } from '$lib/io/HexOps';
	import { generateID } from '$lib/io/GenerateID';
	import { createFileStore } from '$lib/io/Stores'; //@ts-ignore
	import Table from 'flowbite-svelte/Table.svelte'; //@ts-ignore
	import TableHead from 'flowbite-svelte/TableHead.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import TableBody from 'flowbite-svelte/TableBody.svelte'; //@ts-ignore
	import TableBodyCell from 'flowbite-svelte/TableBodyCell.svelte'; //@ts-ignore
	import TableBodyRow from 'flowbite-svelte/TableBodyRow.svelte'; //@ts-ignore
	import TableHeadCell from 'flowbite-svelte/TableHeadCell.svelte';

	let syncWorker: Worker | undefined = undefined;

	const datasets: ExternalDataset[] = [
		{
			name: 'ElectionList',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of All Elections since 1950'
		},
		{
			name: 'Leader List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of All Leaders Since 1950'
		},
		{
			name: 'Regime List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/regime_list.csv',
			description: 'List of All regimes'
		}
	];

	const addURLToDatabase = async (dataset: ExternalDataset) => {
		let fileextension: string = '';
		let filename: string = '';
		const response = await fetch(dataset.url);
		var buffer = await response.arrayBuffer();
		filename = dataset.url.split('/').pop();
		if (filename) fileextension = filename.split('.').pop();

		var size = buffer.byteLength / 1000;

		console.log(filename, fileextension);
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

		createFileStore(filename, arrayBuffer.byteLength, id);
		if (syncWorker) {
			syncWorker.postMessage({
				filename: dataset.name,
				size: arrayBuffer.byteLength / 1000,
				id: id,
				message: 'initialize',
				hexadecimal: hex,
				fileextension: dataset.url.split('.').pop()
			});
		}
	};
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
