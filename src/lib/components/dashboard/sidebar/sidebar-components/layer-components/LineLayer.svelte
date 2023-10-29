<script lang="ts">
	import { LineLayer } from '@deck.gl/layers';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import Dropdown from '../utils/Dropdown.svelte';
	import { getColumnsFromFile } from '$lib/io/Stores';

	$: columns = getColumnsFromFile();
	let width = 12;
	let pickable = true;
	let fromLatitude = 'from_latitude';
	let fromLongitude = 'from_longitude';
	let toLatitude = 'to_latitude';
	let toLongitude = 'to_longitude';

	$: i = clickedChartIndex();
	const CHUNK_SIZE = 100000;

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				from: {
					coordinates: [row[fromLongitude], row[fromLatitude]]
				},
				to: {
					coordinates: [row[toLongitude], row[toLatitude]]
				},
				inbound: row.inbound,
				outbound: row.outbound
			};
			data.push(obj);

			if (data.length >= CHUNK_SIZE) {
				yield data; // Yield the chunk when it reaches the CHUNK_SIZE
				data = []; // Reset the data list for the next chunk
			}
		}

		if (data.length > 0) {
			yield data;
		}
	}

	async function* loadData() {
		const chart = $allCharts[$i];

		if (chart?.filename) {
			const filename = checkNameForSpacesAndHyphens(chart.filename);
			const rows = $duckDBInstanceStore.streamTableRows(`SELECT * FROM ${filename}`);
			yield* transformRows(rows);
		}
	}

	$: {
		const newLayer = new LineLayer({
			data: loadData(),
			// @ts-ignore
			getColor: (d) => [Math.sqrt(d.inbound + d.outbound), 140, 0], // @ts-ignore
			getSourcePosition: (d) => d.from.coordinates, // @ts-ignore
			getTargetPosition: (d) => d.to.coordinates,
			getWidth: width,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			const layerID = newLayer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);
			updatedLayers.push(newLayer);
			return updatedLayers;
		});
	}
</script>

<div>Line Layer</div>

<!-- Input controls to modify properties of the LineLayer -->
<div>
	<input type="range" bind:value={width} min="1" max="30" step="0.5" title="Change Width" />
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>
<Dropdown
	columnType="fromLatitude"
	items={$columns}
	on:choose={() => {
		console.log('fromLatitude');
	}}
/>

<Dropdown
	columnType="toLatitude"
	items={$columns}
	on:choose={() => {
		console.log('toLatitude');
	}}
/>
<Dropdown
	columnType="fromLongitude"
	items={$columns}
	on:choose={() => {
		console.log('fromLongitude');
	}}
/>
<Dropdown
	items={$columns}
	columnType="toLongitude"
	on:choose={() => {
		console.log('toLongitude');
	}}
/>
