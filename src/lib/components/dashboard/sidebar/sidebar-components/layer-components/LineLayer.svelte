<script lang="ts">
	import { LineLayer } from '@deck.gl/layers';
	import {
		rerender,
		layers,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore,
		getColumnsFromFile
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import Dropdown from '../utils/Dropdown.svelte';

	export let id: string;
	console.log('H3 Layer: ', id);

	let width = 12;
	let pickable = true;
	let fromLatitude = 'from_latitude';
	let fromLongitude = 'from_longitude';
	let toLatitude = 'to_latitude';
	let toLongitude = 'to_longitude';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();
	const CHUNK_SIZE = 100000;

	$: {
		const newLayerType: LineLayer = {
			layerType: 'Line',
			pickable: pickable,
			fromLatitude: fromLatitude,
			fromLongitude: fromLongitude,
			toLatitude: toLatitude,
			toLongitude: toLongitude,
			color: 'black'
		};

		if ($allCharts && $allCharts.length > $i && $allCharts[$i]) {
			let layerToUpdate = $allCharts[$i].layers.find((l) => l.layerID === id);

			if (layerToUpdate) {
				allCharts.update((currentCharts) => {
					let updatedCharts = [...currentCharts];
					const layerIndex = updatedCharts[$i].layers.findIndex((l) => l.layerID === id);
					updatedCharts[$i].layers[layerIndex] = {
						layerID: id,
						layer: newLayerType
					};
					return updatedCharts;
				});
			} else {
				allCharts.update((currentCharts) => {
					let updatedCharts = [...currentCharts];
					updatedCharts[$i].layers.push({
						layerID: id,
						layer: newLayerType
					});
					return updatedCharts;
				});
			}
		}
	}

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

	$: if ($rerender > 0) {
		const newLayer = new LineLayer({
			id: id,
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
			updatedLayers.push({ id: id, layer: newLayer });
			return updatedLayers;
		});
	}
</script>

<div {id}>
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
</div>
