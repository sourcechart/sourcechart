<script lang="ts">
	import {
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		Button,
		TableBodyCell,
		TableBodyRow
	} from 'flowbite-svelte';
	import { bufferToHex } from '$lib/io/HexOps';
	import { generateID } from '$lib/io/GenerateID';
	import { createFileStore } from '$lib/io/Stores';

	let syncWorker: Worker | undefined = undefined;
	const addURLToDatabase = async (dataset: ExternalDataset) => {
		const response = await fetch(dataset.url);
		var buffer = await response.arrayBuffer();
		uploadToSQLITE(buffer, dataset);
	};

	const uploadToSQLITE = async (arrayBuffer: ArrayBuffer, dataset: ExternalDataset) => {
		var id = generateID();
		var hex = bufferToHex(arrayBuffer);

		createFileStore(dataset.name, arrayBuffer.byteLength, id);
		if (syncWorker) {
			syncWorker.postMessage({
				filename: dataset.name,
				size: arrayBuffer.byteLength,
				id: id,
				message: 'initialize',
				hexadecimal: hex,
				fileextension: dataset.url.split('.').pop()
			});
		}
	};

	let datasets: ExternalDataset[] = [
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
