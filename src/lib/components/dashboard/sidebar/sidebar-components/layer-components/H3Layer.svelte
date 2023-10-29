<script lang="ts">
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { getColumnsFromFile } from '$lib/io/Stores';
	import Dropdown from '../utils/Dropdown.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let elevationScale = 20;
	let extruded = true;
	let filled = true;
	let wireframe = false;
	let pickable = true;

	let hexColumn = 'H3_Index';
	let countColumn = 'Count';

	const CHUNK_SIZE = 100000;

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				hex: row[hexColumn],
				count: row[countColumn]
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

	const loadData = async function* () {
		let chart = $allCharts[$i];

		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			const rows = $duckDBInstanceStore.streamTableRows(`SELECT * FROM ${filename}`);
			yield* transformRows(rows);
		}
	};

	$: {
		const layer = new H3HexagonLayer({
			data: loadData(),
			elevationScale: elevationScale,
			extruded: extruded,
			filled: filled, // @ts-ignore
			getElevation: (d) => d.count, // @ts-ignore
			getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0], // @ts-ignore
			getHexagon: (d) => d.hex, // @ts-ignore
			wireframe: wireframe,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			const layerID = layer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);

			updatedLayers.push(layer);

			return updatedLayers;
		});
	}

	const handleChoose = (e: CustomEvent) => {
		hexColumn = e.detail.hexColumn;
		countColumn = e.detail.countColumn;
	};
</script>

<div>H3 Layer</div>

<!-- Input controls to modify properties of the H3HexagonLayer -->
<div>
	<input
		type="range"
		bind:value={elevationScale}
		min="1"
		max="50"
		step="0.5"
		title="Change Elevation Scale"
	/>
	<label>
		<input type="checkbox" bind:checked={extruded} />
		Extruded
	</label>
	<label>
		<input type="checkbox" bind:checked={filled} />
		Filled
	</label>
	<label>
		<input type="checkbox" bind:checked={wireframe} />
		Wireframe
	</label>
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>
<Dropdown columnType="H3" items={$columns} on:choose={handleChoose} />
