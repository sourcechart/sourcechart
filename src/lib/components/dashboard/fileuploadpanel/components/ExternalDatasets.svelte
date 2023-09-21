<script lang="ts">
	import { ChevronDoubleDownOutline } from 'flowbite-svelte-icons'; //@ts-ignore
	import Table from 'flowbite-svelte/Table.svelte'; //@ts-ignore
	import TableHead from 'flowbite-svelte/TableHead.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import TableBody from 'flowbite-svelte/TableBody.svelte'; //@ts-ignore
	import TableBodyCell from 'flowbite-svelte/TableBodyCell.svelte'; //@ts-ignore
	import TableBodyRow from 'flowbite-svelte/TableBodyRow.svelte'; //@ts-ignore
	import TableHeadCell from 'flowbite-svelte/TableHeadCell.svelte'; //@ts-ignore
	import Spinner from 'flowbite-svelte/Spinner.svelte'; //@ts-ignore
	import { generateID } from '$lib/io/GenerateID';
	import { datasets } from './Datasets';
	import { fileUploadStore } from '$lib/io/Stores';

	let isLoading = false;

	const addURLToDatabase = (dataset: ExternalDataset) => {
		isLoading = true;
		var tableColumnsSize = {
			filename: dataset.name,
			file: dataset,
			datasetID: generateID(),
			size: null,
			fileExtension: dataset.name.split('.').pop()
		};

		fileUploadStore.update((fileUploadStore) => [...fileUploadStore, tableColumnsSize]);
	};

	function downloadRawCSV(csvData: string, filename: string) {
		const blob = new Blob([csvData], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');

		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', filename);

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	const downloadRawDataset = async (dataset: ExternalDataset) => {
		try {
			const response = await fetch(dataset.url);
			console.log(response);
			const data = await response.text(); // Assuming the data is in JSON format
			console.log(data);

			downloadRawCSV(data, dataset.url.split('/').pop() + '');
		} catch (error) {
			console.error('Error downloading dataset:', error);
		}
	};
</script>

<div class="table-container scrollBarDiv">
	{#if isLoading}
		<div class="loading-container flex">
			<span class="mr-2">Loading...</span>
			<Spinner size={40} />
		</div>
	{:else}
		<Table>
			<TableHead>
				<TableHeadCell>Dataset</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell />
				<TableBodyCell />
			</TableHead>
		</Table>
		<TableBody>
			{#each datasets as dataset}
				<TableBodyRow>
					<TableBodyCell>{dataset.name}</TableBodyCell>
					<TableBodyCell>{dataset.description}</TableBodyCell>

					<TableBodyCell>
						<Button pill={false} outline on:click={() => addURLToDatabase(dataset)}
							>Add Dataset</Button
						>
					</TableBodyCell>
					<TableBodyCell>
						<Button pill={false} outline on:click={() => downloadRawDataset(dataset)}>
							<div class="flex flex-row justify-between items-center">
								<span class="mr-2">Download Raw CSV</span>
								<!-- Added the `mr-2` for right margin -->
								<ChevronDoubleDownOutline class="h-4 w-4 " />
							</div>
						</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	{/if}
</div>

<style>
	.table-container {
		height: 300px; /* Adjust this height as per your needs */
		overflow-y: auto;
		overflow-x: auto;
	}

	.table-container {
		height: 300px; /* Adjust this height as per your needs */
		overflow-y: auto;
		overflow-x: auto;
		display: flex; /* Add this line */
		justify-content: center; /* Add this line */
		align-items: center; /* Add this line */
	}

	.loading-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px; /* Adjust this value to your desired maximum height */
		overflow-y: auto;
	}
</style>
