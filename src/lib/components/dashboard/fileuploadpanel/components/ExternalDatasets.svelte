<script lang="ts">
	//@ts-ignore
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
			const data = await response.text(); // Assuming the data is in JSON format\
			downloadRawCSV(data, dataset.url.split('/').pop() + '');
		} catch (error) {
			console.error('Error downloading dataset:', error);
		}
	};
</script>

<div class="scrollBarDiv w-96 table-container overflow-y-auto" style="max-height: 400px;">
	<table class="w-full bg-neutral-800 text-white border border-neutral-600 rounded-lg">
		<thead>
			<tr class="bg-neutral-600">
				<th class="py-3 px-4 text-left">Dataset</th>
				<th class="py-3 px-4 text-left">Description</th>
				<th class="py-3 px-4" />
				<th class="py-3 px-4" />
			</tr>
		</thead>
		<tbody class="divide-y">
			{#each datasets as dataset}
				<tr class="hover:bg-neutral-700 ml-2 mt-2">
					<td class="py-2 px-4 text-sm mt-2">{dataset.name}</td>
					<td class="py-2 px-4 text-sm mt-2">{dataset.description}</td>
					<td class="py-2 px-4">
						<button
							class="px-4 py-2 text-blue-300 hover:underline border border-blue-300 rounded"
							on:click={() => addURLToDatabase(dataset)}>Add Dataset</button
						>
					</td>
					<td class="py-2 px-4">
						<button class="px-4 py-2 text-blue-300 hover:underline">
							<div class="flex flex-row justify-between items-center">
								<button
									on:click={async () => {
										downloadRawDataset(dataset);
									}}
								>
									<span class="mr-2">Download Raw CSV</span>
								</button>
							</div>
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
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

	.scrollBarDiv {
		height: 300px;
		overflow-y: auto;
		overflow-x: auto;
		display: flex;
		justify-content: center;
		align-items: center;
		max-height: 400px; /* Adjust this value to your desired maximum height */
	}

	/* Updated scrollbar styles for Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 400px; /* Adjust this value to your desired maximum height */
		overflow-y: auto;
	}
</style>
