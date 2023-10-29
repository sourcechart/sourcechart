<script lang="ts">
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { getColumnsFromFile } from '$lib/io/Stores';
	import Dropdown from '../utils/Dropdown.svelte';
	import { generateID } from '$lib/io/GenerateID';
	import { deepEqual } from './utils';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	export let id: string;

	let elevationScale = 1;
	let extruded = true;
	let filled = true;
	let wireframe = false;
	let pickable = true;

	let hexColumn = 'H3_Index';
	let countColumn = 'Count';

	const CHUNK_SIZE = 100000;

	$: {
		if ($allCharts && $allCharts.length > $i && $allCharts[$i]) {
			const newLayer: H3HexagonLayer = {
				type: 'H3HexagonLayer',
				wireframe: wireframe,
				pickable: pickable,
				elevationScale: elevationScale,
				filled: filled,
				countColumn: countColumn,
				extruded: extruded,
				hexColumn: hexColumn,
				fillColor: [255, (1 - 1 / 500) * 255, 0]
			};

			if (!deepEqual($allCharts[$i].layers[0].type, newLayer)) {
				allCharts.update((currentCharts) => {
					let updatedCharts = [...currentCharts];
					updatedCharts[$i].layers[0] = {
						layerID: generateID(),
						type: newLayer
					};
					return updatedCharts;
				});
			}
		}
	}

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				hex: row[hexColumn],
				count: row[countColumn]
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
			updatedLayers.push({
				id: id,
				layer: layer
			});
			return updatedLayers;
		});
	}

	const handleHexChoose = (e: CustomEvent) => {
		hexColumn = e.detail.column;
	};

	const handleCountChoose = (e: CustomEvent) => {
		countColumn = e.detail.column;
	};
</script>

<div {id}>
	<div>H3 Layer</div>

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
	<Dropdown columnType="H3" items={$columns} on:choose={handleHexChoose} />
	<Dropdown columnType="count" items={$columns} on:choose={handleCountChoose} />
</div>
