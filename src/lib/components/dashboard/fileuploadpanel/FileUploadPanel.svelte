<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';
	import DropZone from './components/DropZone.svelte';
	import { CloseButton } from 'flowbite-svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button
	} from 'flowbite-svelte';

	import { createFileStore } from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';
	import { bufferToHex } from '$lib/io/HexOps';

	let syncWorker: Worker | undefined = undefined;

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

	const handleClick = () => {
		activeDropZone.set(false);
		activeSidebar.set(true);
	};

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
</script>

<div
	class="relative dark:bg-gray-700 bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 w-auto sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10 overflow-hidden"
>
	<div class="mx-auto max-w-full">
		<h1 class="text-xl dark:text-gray-300">Add Data to Plot</h1>
		<div class="close-button">
			<CloseButton class="close-button" on:click={handleClick} />
		</div>
		<Tabs style="underline" contentClass="p-4 rounded-lg mt-4">
			<TabItem title="Load Files" open>
				<DropZone />
			</TabItem>
			<TabItem title="External Datasets">
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
			</TabItem>
		</Tabs>
	</div>
</div>

<style>
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>
