<script lang="ts">
	import { generateID } from '$lib/io/GenerateID';
	import { datasets } from './Datasets';
	import { fileUploadStore, activeDropZone } from '$lib/io/Stores';

	const addURLToDatabase = (dataset: ExternalDataset) => {
		var tableColumnsSize = {
			filename: dataset.name,
			externalDataset: dataset,
			datasetID: generateID(),
			size: null,
			fileExtension: ''
		};

		fileUploadStore.update((fileUploadStore) => [...fileUploadStore, tableColumnsSize]);
		activeDropZone.set(false);
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
			const data = await response.text(); // Assuming the data is in JSON format\
			downloadRawCSV(data, dataset.url.split('/').pop() + '');
		} catch (error) {
			console.error('Error downloading dataset:', error);
		}
	};
</script>

<div class="overflow-y-auto scrollBarDiv">
	<table class="w-full bg-white text-gray-500">
		<thead>
			<tr>
				<th class="py-2 px-2 sm:px-4 text-sm border-neutral-6 text-left flex justify-center"
					>Dataset Name</th
				>
				<th class="hidden md:table-cell py-2 px-2 sm:px-4 text-sm justify-center">Description</th>
				<th class="py-2 px-2 sm:px-4 text-sm flex justify-center">Actions</th>
				<th class="py-2 px-2 sm:px-4 text-sm">Download</th>
			</tr>
		</thead>
		<tbody class="border border-1 border-neutral-200">
			{#each datasets as dataset, index}
				<tr class={index % 2 === 0 ? 'bg-neutral-600/10' : ''}>
					<td class="py-2 px-2 sm:px-4 text-xs mt-2">{dataset.name}</td>
					<td class="hidden md:table-cell py-2 px-2 sm:px-4 text-xs mt-2">{dataset.description}</td>
					<td class="p-1 sm:px-4">
						<button
							class="text-blue-300 text-sm hover:underline border border-blue-300 rounded"
							on:click={() => addURLToDatabase(dataset)}
						>
							Add Dataset
						</button>
					</td>
					<td class="p-1 sm:px-4">
						<div
							class="text-blue-300 border-blue-300 hover:underline text-sm flex justify-between items-center"
						>
							<button
								class="text-blue-300 text-sm hover:underline border border-blue-300 rounded"
								on:click={async () => downloadRawDataset(dataset)}
							>
								<span class="mr-2">Download Raw CSV</span>
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.scrollBarDiv {
		max-height: 24rem; /* Adjust to fit your design */

		/* Overflow properties */
		overflow-y: auto;
		overflow-x: auto;
	}
</style>
