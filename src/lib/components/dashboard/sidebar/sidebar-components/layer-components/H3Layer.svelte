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
	import { scaleQuantile } from 'd3-scale';
	import ColorDropdown from './utils/ColorDropdown.svelte';
	import Dropdown from '../utils/Dropdown.svelte';

	export let id: string;
	export let defaultLayer: any;

	let globalMin: number;
	let globalMax: number;
	const CHUNK_SIZE = 100000;
	let wireframe = defaultLayer?.wireframe || false;
	let pickable = defaultLayer?.pickable || true;
	let elevationScale = defaultLayer?.elevationScale || 1;
	let filled = defaultLayer?.filled || true;
	let countColumn = defaultLayer?.countColumn || 'Count';
	let extruded = defaultLayer?.extruded || true;
	let hexColumn = defaultLayer?.hexColumn || 'H3_Index';
	let scaleQuant: any;
	let currentColorScale: ColorPalletes = ColorPalletes.BLUES; // Default to REDS
	const colorScale = new ColorScale(5);

	type Data = {
		hex: string;
		count: number;
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

	const handleColorChoose = (e: CustomEvent) => {
		currentColorScale = e.detail.scale;
	};

	const getMinMax = async () => {
		let chart = $allCharts[$i];
		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			$duckDBInstanceStore
				.query(`SELECT MIN(${countColumn}) as min, MAX(${countColumn}) as max FROM ${filename}`)
				.then((result) => {
					globalMax = result[0].max;
					globalMin = result[0].min;
				});
		}
	};

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
		await getMinMax();

		let chart = $allCharts[$i];

		if (chart.filename) {
			var filename = checkNameForSpacesAndHyphens(chart.filename);
			const rows = $duckDBInstanceStore.streamTableRows(`SELECT * FROM ${filename}`);
			yield* transformRows(rows);
		}
	};

	$: {
		console.log(colorScale.getRGBColorArray(currentColorScale));
		scaleQuant = scaleQuantile()
			.domain([globalMin, globalMax]) // Set the domain with your min and max
			.range(colorScale.getRGBColorArray(currentColorScale)); // Assuming this returns
	}

	$: if ($rerender > 0 || currentColorScale) {
		const layerInstance = new H3HexagonLayer({
			id: id,
			data: loadData(),
			elevationScale: 1,
			extruded: extruded,
			filled: filled,
			getElevation: (d: Data) => d.count,
			getFillColor: (d: Data) => scaleQuant(d.count),
			getHexagon: (d: Data) => d.hex,
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
