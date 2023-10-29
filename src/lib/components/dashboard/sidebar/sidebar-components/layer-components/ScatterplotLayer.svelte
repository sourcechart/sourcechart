<script lang="ts">
	import { ScatterplotLayer } from '@deck.gl/layers';
	import {
		layers,
		getColumnsFromFile,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import Dropdown from '../utils/Dropdown.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	let nameColumn = 'name';
	let codeColumn = 'code';
	let addressColumn = 'address';
	let exitsColumn = 'exits';
	let coordinatesLatitude = 'latitude';
	let coordinatesLongitude = 'longitude';
	let fillColor = [255, 140, 0];
	let lineColor = [0, 0, 0];
	let opacity = 0.8;
	let radiusScale = 6;
	let pickable = true;

	const CHUNK_SIZE = 100000;

	async function* transformRows(rows: AsyncIterable<any>) {
		let data = [];
		for await (const row of rows) {
			const obj = {
				name: row[nameColumn],
				code: row[codeColumn],
				address: row[addressColumn],
				exits: row[exitsColumn],
				coordinates: [row[coordinatesLongitude], row[coordinatesLatitude]]
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
		const scatterLayer = new ScatterplotLayer({
			data: loadData(),
			radiusScale: 3,
			radiusMinPixels: 0.25, //@ts-ignore
			getPosition: (d) => [d[0], d[1], 0], //@ts-ignore
			getFillColor: (d) => (d[2] === 1 ? 'red' : 'blue'),
			getRadius: 1,
			updateTriggers: {
				getFillColor: ['red', 'blue']
			}
		});

		layers.update((currentLayers) => {
			let updatedLayers = currentLayers.filter((layer) => layer.id !== 'ScatterplotLayer');
			updatedLayers.push(scatterLayer);
			return updatedLayers;
		});
	}

	const handleChoose = () => {
		console.log('choose');
	};
</script>

<div>Scatter Plot Layer</div>

<!-- Input controls to modify properties of the ScatterplotLayer -->
<div>
	<input type="color" bind:value={fillColor} title="Change Fill Color" />
	<input type="color" bind:value={lineColor} title="Change Line Color" />
	<input type="range" bind:value={radiusScale} min="1" max="10" step="0.5" />
	<input type="range" bind:value={opacity} min="0" max="1" step="0.1" />
	<input type="checkbox" bind:checked={pickable} /> Pickable
</div>
<Dropdown columnType="startPoint" items={$columns} on:choose={handleChoose} />
<Dropdown columnType="endPoint" items={$columns} on:choose={handleChoose} />
