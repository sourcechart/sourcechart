<script lang="ts">
	import {
		layers,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore,
		rerender
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { ColorScale, ColorPalletes } from './utils/ColorScale';
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { getColumnsFromFile } from '$lib/io/Stores';
	import { deepEqual } from './utils/utils';

	import * as d3 from 'd3';
	import ColorDropdown from './utils/ColorDropdown.svelte';
	import Dropdown from '../utils/Dropdown.svelte';

	export let id: string;
	export let defaultLayer: any;

	const colorScale = new ColorScale(5);
	const CHUNK_SIZE = 100000;
	let wireframe = defaultLayer?.wireframe || false;
	let pickable = defaultLayer?.pickable || true;
	let elevationScale = defaultLayer?.elevationScale || 1;
	let filled = defaultLayer?.filled || true;
	let countColumn = defaultLayer?.countColumn || 'Count';
	let extruded = defaultLayer?.extruded || true;
	let hexColumn = defaultLayer?.hexColumn || 'H3_Index';

	let currentColorScale: ColorPalletes = ColorPalletes.BLUES; // Default to REDS

	const handleColorChoose = (e: CustomEvent) => {
		console.log(e.detail);
		currentColorScale = e.detail.scale;
		console.log(currentColorScale);
	};

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();
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

	$: if ($rerender > 0 || currentColorScale) {
		const layerInstance = new H3HexagonLayer({
			id: id,
			data: loadData(),
			elevationScale: elevationScale,
			extruded: extruded,
			filled: filled, //@ts-ignore
			getElevation: (d) => d.count, //@ts-ignore
			getFillColor: (d) => {
				const colorHex = colorScale.getColorFromValue(currentColorScale, d.count);
				if (!colorHex) {
					return [0, 0, 0, 0];
				} else {
					//@ts-ignore
					const rgba = d3.color(colorHex).rgb();
					return [rgba.r, rgba.g, rgba.b, 255]; // Assuming full opacity
				}
			}, //@ts-ignore
			getHexagon: (d) => d.hex,
			wireframe: wireframe,
			pickable: pickable,
			updateTrigger: {
				getFillColor: [currentColorScale, countColumn], // add currentColorScale as a dependency
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
		currentValue={defaultLayer.hexColumn}
		on:choose={handleHexChoose}
	/>
	<Dropdown
		columnType="count"
		items={$columns}
		currentValue={defaultLayer.countColumn}
		on:choose={handleCountChoose}
	/>
</div>

<span>Colors</span>
<ColorDropdown on:choose={handleColorChoose} />
