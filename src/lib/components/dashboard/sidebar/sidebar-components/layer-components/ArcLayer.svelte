<script lang="ts">
	import { ArcLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import ColumnDropdown from '../utils/Dropdown.svelte';

	$: i = clickedChartIndex();
	let getWidth = 12;
	let pickable = true;
	const CHUNK_SIZE = 100000;

	let fromLatitude = 'from_latitude';
	let fromLongitude = 'from_longitude';
	let toLatitude = 'to_latitude';
	let toLongitude = 'to_longitude';

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
		const newLayer = new ArcLayer({
			id: generateID(),
			data: loadData(),
			// @ts-ignore
			getSourceColor: (d) => [Math.sqrt(d.inbound), 140, 0], // @ts-ignore
			getSourcePosition: (d) => d.from.coordinates, // @ts-ignore
			getTargetColor: (d) => [Math.sqrt(d.outbound), 140, 0], // @ts-ignore
			getTargetPosition: (d) => d.to.coordinates,
			getWidth: getWidth,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			const layerID = newLayer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);
			updatedLayers.push(newLayer);
			return updatedLayers;
		});
	}

	const handleChoose = (e: CustomEvent) => {
		let column = e.detail.column;
		allCharts.update((charts) => {
			let chart = charts[$i];
			console.log(chart.layers);
			return charts;
		});
	};
</script>

<div>Arc Layer</div>

<!-- Input controls to modify properties of the ArcLayer -->
<div>
	<input type="range" bind:value={getWidth} min="1" max="50" step="0.5" title="Change Width" />
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>

<ColumnDropdown columnType="startPoint" on:choose={handleChoose} />
<ColumnDropdown columnType="endPoint" on:choose={handleChoose} />
