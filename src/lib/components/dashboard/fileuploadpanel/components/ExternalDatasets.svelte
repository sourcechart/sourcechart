<script lang="ts">
	//@ts-ignore
	import { generateID } from '$lib/io/GenerateID';
	import { datasets } from './Datasets';
	import { fileUploadStore, activeDropZone } from '$lib/io/Stores';

	let isLoading = false;

	const addURLToDatabase = (dataset: ExternalDataset) => {
		isLoading = true;
		var tableColumnsSize = {
			filename: dataset.name,
			externalDataset: dataset,
			filehandle: null,
			datasetID: generateID(),
			size: null,
			fileExtension: dataset.name.split('.').pop()
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
	<table class="w-full bg-neutral-800 text-white border border-neutral-600 rounded-lg">
		<thead>
			<tr>
				<th class="py-2 px-2 sm:px-4 text-sm border-b border-neutral-6 text-left 00">Name</th>
				<th class="hidden md:table-cell py-2 px-2 sm:px-4 text-sm border-b border-neutral-600"
					>Description</th
				>
				<th class="py-2 px-2 sm:px-4 text-sm border-b border-neutral-600">Actions</th>
				<th class="py-2 px-2 sm:px-4 text-sm border-b border-neutral-600">Download</th>
			</tr>
		</thead>
		<tbody>
			{#each datasets as dataset}
				<tr class="hover:bg-neutral-700">
					<td class="py-2 px-2 sm:px-4 text-sm mt-2">{dataset.name}</td>
					<td class="hidden md:table-cell py-2 px-2 sm:px-4 text-sm mt-2">{dataset.description}</td>
					<td class="py-2 px-2 sm:px-4">
						<button
							class="text-blue-300 hover:underline border border-blue-300 rounded"
							on:click={() => addURLToDatabase(dataset)}
						>
							Add Dataset
						</button>
					</td>
					<td class="py-2 px-2 sm:px-4">
						<div class="text-blue-300 hover:underline flex justify-between items-center">
							<button on:click={async () => downloadRawDataset(dataset)}>
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
		/* Remove the fixed height */
		max-height: 14rem; /* Or adjust this to a value that fits your design better */

		/* Overflow properties */
		overflow-y: auto;
		overflow-x: auto;

		/* Scrollbar styles for Webkit browsers */
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
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
</style>
