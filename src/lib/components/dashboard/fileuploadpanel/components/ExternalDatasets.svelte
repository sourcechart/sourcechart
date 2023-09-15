<script lang="ts">
	import { bufferToHex } from '$lib/io/HexOps';
	import { generateID } from '$lib/io/GenerateID';
	import { onMount } from 'svelte';
	import { activeDropZone, createFileStore } from '$lib/io/Stores'; //@ts-ignore
	import { ChevronDoubleDownOutline } from 'flowbite-svelte-icons';
	//@ts-ignore
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
		},
		{
			name: 'Crude Birth Rate North Korea (per 1000 people)',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPDYNCBRTINPRK.csv',
			description: 'Child Birth Rate in North Korea from 1961 to 2021'
		},
		{
			name: 'Infant Mortality Rate North Korea',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPDYNIMRTINPRK.csv',
			description: 'Infant Mortality Rate in North Korea from 1961 to 2021'
		},
		{
			name: 'Infant Mortality Rate China',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPDYNIMRTINCHN.csv',
			description: 'Infant Mortality Rate in China from 1961 to 2021'
		},
		{
			name: 'Fertility Rate, Total China',
			url: 'https://github.com/sourcechart/publicdata/blob/main/datasets/SPDYNTFRTINCHN.csv',
			description: 'Fertility Rate in China from 1961 to 2021'
		},
		{
			name: 'Fertility Rate, Total North Korea',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPDYNTFRTINPRK.csv',
			description: 'Fertility Rate in North Korea from 1961 to 2021'
		},
		{
			name: 'Population Ages 0 to 14 for North Korea ',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPPOPTOTLNAFGNK.csv',
			description: 'Population Ages 0 to 14 for North Korea from 1961 to 2021'
		},
		{
			name: 'Population Ages 65 and Up for North Korea',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/SPPOP65UPTOZSPRK.csv',
			description: 'Population Ages 65 and Up for North Korea from 1961 to 2021'
		},
		{
			name: 'Adult Mortality National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/adult-mortality_national_nga.csv',
			description: 'Adult Mortality National Nigeria'
		},
		{
			name: 'Child Mortality National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/child-mortality_national_nga.csv',
			description: 'Child Mortality National Nigeria'
		},
		{
			name: 'Economy and Growth Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/economy-and-growth_hun.csv',
			description: 'Economy and Growth Hungary'
		},
		{
			name: 'Fertility National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/fertility-national_nga.csv',
			description: 'Fertility National Nigeria'
		},
		{
			name: 'Health Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/health_hun.csv',
			description: 'Health Hungary'
		},
		{
			name: 'Health Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/health_nga.csv',
			description: 'Health Indicators in Nigeria'
		},
		{
			name: 'HIV Behavior National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/hiv-behavior_national_nga.csv',
			description: 'HIV Behavior National Nigeria'
		},
		{
			name: 'Indicators China',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/indicators_chn.csv',
			description: 'Indicators China'
		},
		{
			name: 'Indicators Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/indicators_hun.csv',
			description: 'Indicators Hungary'
		},
		{
			name: 'Mens Fertility and Family Planning National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/mens-fertility-and-family-planning_national_nga.csv',
			description: 'Mens Fertility and Family Planning National Nigeria'
		},
		{
			name: 'Poverty China',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/poverty_chn.csv',
			description: 'Poverty China'
		},
		{
			name: 'Poverty Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/poverty_hun.csv',
			description: 'Poverty Hungary'
		},
		{
			name: 'Poverty Israel',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/poverty_isr.csv',
			description: 'Poverty in Israel'
		},
		{
			name: 'Private Sector Development Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/private-sector_hun.csv',
			description: 'Private Sector Development Hungary'
		},
		{
			name: 'QC Economy and Growth Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/qc_economy-and-growth_hun.csv',
			description: 'QC Economy and Growth Hungary'
		},
		{
			name: 'SDG and Data Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/sdg_data_hun.csv',
			description: 'SDG and Data Hungary'
		},
		{
			name: 'Select Gender Indicators National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/select-gender-indicators_national_nga.csv',
			description: 'Select Gender Indicators National Nigeria'
		},
		{
			name: 'Select Intercourse National Nigeria',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/select-intercourse_national_nga.csv',
			description: 'Select Intercourse National Nigeria'
		},
		{
			name: 'Social Development in Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/social-development_hun.csv',
			description: 'Social Development in Hungary'
		},
		{
			name: 'Urban Development China',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/urban-development_chn.csv',
			description: 'Urban Development China'
		},
		{
			name: 'Urban Development Hungary',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/urban-development_hun.csv',
			description: 'Urban Development Hungary'
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

			downloadRawCSV(data, 'dataset.csv');
		} catch (error) {
			console.error('Error downloading dataset:', error);
		}
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
				<TableBodyCell>
					<button on:click={() => downloadRawDataset(dataset)}>
						<ChevronDoubleDownOutline class="h-4 w-4 hover:bg-gray-300" />
					</button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</div>
