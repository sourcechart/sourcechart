<script lang="ts">
	import { PathLayer } from '@deck.gl/layers';
	import {
		layers,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore,
		getColumnsFromFile
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import Dropdown from '../utils/Dropdown.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let widthMinPixels = 2;
	let widthScale = 20;
	let pickable = true;
	let pathColumn = 'path';
	let nameColumn = 'name';
	let colorColumn = 'color';

	const CHUNK_SIZE = 100000;

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				path: JSON.parse(row[pathColumn]),
				name: row[nameColumn],
				color: JSON.parse(row[colorColumn])
			};
			data.push(obj);

			if (data.length >= CHUNK_SIZE) {
				yield data;
				data = [];
			}
		}

		if (data.length > 0) {
			yield data;
		}
	}

	const loadData = async function* () {
		let chart = $allCharts[$i];

		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			const rows = $duckDBInstanceStore.streamTableRows(`SELECT * FROM ${filename}`);
			yield* transformRows(rows);
		}
	};

	$: {
		const layer = new PathLayer({
			data: loadData(),
			getColor: (d) => {
				const hex = d.color;
				return hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16));
			},
			getPath: (d) => d.path,
			getWidth: (d) => 5,
			widthMinPixels: widthMinPixels,
			widthScale: widthScale,
			parameters: {
				depthMask: false
			},
			pickable: pickable
		});

		layers.update((currentLayers) => {
			const layerID = layer.id;
			let updatedLayers = currentLayers.filter((l) => l.id !== layerID);
			updatedLayers.push(layer);
			return updatedLayers;
		});
	}

	const handleColumnChoice = (type: string, detail: any) => {
		if (type === 'path') pathColumn = detail.column;
		if (type === 'name') nameColumn = detail.column;
		if (type === 'color') colorColumn = detail.column;
	};
</script>

<div>Path Layer</div>

<div>
	<input
		type="range"
		bind:value={widthMinPixels}
		min="1"
		max="50"
		step="0.5"
		title="Change Width Min Pixels"
	/>
	<input
		type="range"
		bind:value={widthScale}
		min="1"
		max="100"
		step="1"
		title="Change Width Scale"
	/>
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>

<Dropdown
	columnType="path"
	items={$columns}
	on:choose={(e) => handleColumnChoice('path', e.detail)}
/>
<Dropdown
	columnType="name"
	items={$columns}
	on:choose={(e) => handleColumnChoice('name', e.detail)}
/>
<Dropdown
	columnType="color"
	items={$columns}
	on:choose={(e) => handleColumnChoice('color', e.detail)}
/>
