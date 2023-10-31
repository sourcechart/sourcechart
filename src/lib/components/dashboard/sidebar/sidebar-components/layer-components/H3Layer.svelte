<script lang="ts">
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { getColumnsFromFile } from '$lib/io/Stores';
	import Dropdown from '../utils/Dropdown.svelte';
	import { deepEqual } from './utils';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	export let id: string;
	export let defaultLayer: any;
	console.log(defaultLayer);
	const CHUNK_SIZE = 100000;

	// Your default values for the properties
	let wireframe = false;
	let pickable: boolean = true;
	let elevationScale = 1;
	let filled: boolean = true;
	let countColumn = 'Count';
	let extruded: boolean = true;
	let hexColumn = 'H3_Index';

	// Reactive block to update based on changes in defaultLayer
	$: {
		wireframe = defaultLayer?.wireframe || false;
		pickable = defaultLayer?.pickable || true;
		elevationScale = defaultLayer?.elevationScale || 1;
		filled = defaultLayer?.filled || true;
		countColumn = defaultLayer?.countColumn || 'Count';
		extruded = defaultLayer?.extruded || true;
		hexColumn = defaultLayer?.hexColumn || 'H3_Index';
	}
	$: console.log(hexColumn, countColumn);

	$: {
		const newLayer: H3HexagonLayer = {
			layerType: 'H3HexagonLayer',
			wireframe,
			pickable,
			elevationScale,
			filled,
			countColumn,
			extruded,
			hexColumn,
			fillColor: [255, (1 - 1 / 500) * 255, 0]
		};

		let layerToUpdate = $allCharts[$i].layers.find((l) => l.layerID === id);

		if (layerToUpdate) {
			if (!deepEqual(layerToUpdate.layer, newLayer)) {
				allCharts.update((currentCharts) => {
					let updatedCharts = [...currentCharts];
					const layerIndex = updatedCharts[$i].layers.findIndex((l) => l.layerID === id);
					updatedCharts[$i].layers[layerIndex] = {
						layerID: id,
						layer: newLayer
					};
					return updatedCharts;
				});
			}
		} else {
			allCharts.update((currentCharts) => {
				let updatedCharts = [...currentCharts];
				updatedCharts[$i].layers.push({
					layerID: id,
					layer: newLayer
				});
				return updatedCharts;
			});
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
		const layerInstance = new H3HexagonLayer({
			id: id,
			data: loadData(),
			elevationScale: elevationScale,
			extruded: extruded,
			filled: filled, //@ts-ignore
			getElevation: (d) => d.count, //@ts-ignore
			getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0], //@ts-ignore
			getHexagon: (d) => d.hex,
			wireframe: wireframe,
			pickable: pickable,
			updateTrigger: {
				getFillColor: [countColumn],
				getHexagon: [hexColumn],
				getElevation: [countColumn],
				getLineWidth: [countColumn]
			}
		});

		layers.update((currentLayers) => {
			const existingIndex = currentLayers.findIndex((layer) => layer.id === id);
			if (existingIndex !== -1) {
				currentLayers[existingIndex] = { id: id, layer: layerInstance };
			} else {
				currentLayers.push({ id: id, layer: layerInstance });
			}
			return currentLayers;
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
	<Dropdown
		columnType="H3"
		items={$columns}
		on:choose={handleHexChoose}
		bind:currentValue={hexColumn}
	/>
	<Dropdown
		columnType="count"
		items={$columns}
		on:choose={handleCountChoose}
		bind:currentValue={countColumn}
	/>
</div>
