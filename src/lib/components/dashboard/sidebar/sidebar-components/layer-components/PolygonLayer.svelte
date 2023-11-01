<script lang="ts">
	import { PolygonLayer } from '@deck.gl/layers';
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
	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let extruded = true;
	let filled = true;
	let lineColor = [80, 80, 80];
	let lineWidthMinPixels = 1;
	let stroked = true;
	let wireframe = true;
	let pickable = true;

	let coordinatesColumn = 'polygons';

	const CHUNK_SIZE = 100000;

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				polygon: JSON.parse(row[coordinatesColumn])
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

	$: if ($rerender > 0) {
		const newLayer = new PolygonLayer({
			id: id,
			data: loadData(),
			extruded: extruded,
			filled: filled, //@ts-ignore
			getElevation: (d) => d.population / d.area / 10, //@ts-ignore
			getFillColor: (d) => [d.population / d.area / 60, 140, 0],
			getLineColor: lineColor, //@ts-ignore
			getLineWidth: (d) => 1, //@ts-ignore
			getPolygon: (d) => d.contour,
			lineWidthMinPixels: lineWidthMinPixels,
			stroked: stroked,
			wireframe: wireframe,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			currentLayers.push({ id: id, layer: newLayer });
			return currentLayers;
		});
	}

	const handleColumnChoice = (detail: any) => {
		coordinatesColumn = detail.column;
	};
</script>

<div {id}>
	<div>
		<input type="checkbox" bind:checked={extruded} /> Extruded
		<input type="checkbox" bind:checked={filled} /> Filled
		<input
			type="range"
			bind:value={lineWidthMinPixels}
			min="1"
			max="10"
			step="0.5"
			title="Change Line Width Min Pixels"
		/>
		<input type="checkbox" bind:checked={stroked} /> Stroked
		<input type="checkbox" bind:checked={wireframe} /> Wireframe
		<input type="checkbox" bind:checked={pickable} /> Pickable
	</div>

	<Dropdown columnType="polygon" items={$columns} on:choose={(e) => handleColumnChoice(e.detail)} />
</div>
