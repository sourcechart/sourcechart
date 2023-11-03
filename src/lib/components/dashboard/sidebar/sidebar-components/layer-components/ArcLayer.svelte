<script lang="ts">
	import {
		layers,
		allCharts,
		clickedChartIndex,
		duckDBInstanceStore,
		rerender
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import ColumnDropdown from '../utils/Dropdown.svelte';
	import { ArcLayer } from '@deck.gl/layers';
	import { deepEqual } from './utils';

	export let id: string;

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
		if ($allCharts && $allCharts.length > $i && $allCharts[$i]) {
			const newArcLayer: ArcLayer = {
				layerType: 'Arc',
				fromLatitudeColumn: fromLatitude,
				fromLongitudeColumn: fromLongitude,
				toLatitudeColumn: toLatitude,
				toLongitudeColumn: toLongitude,
				width: getWidth, // Assuming getWidth is a numeric value or function elsewhere in your code
				pickable: pickable
			};

			if (!deepEqual($allCharts[$i].layers[0].layer, newArcLayer)) {
				allCharts.update((currentCharts) => {
					let updatedCharts = [...currentCharts];
					updatedCharts[$i].layers = [
						...updatedCharts[$i].layers,
						{
							layerID: id,
							layer: newArcLayer
						}
					];
					return updatedCharts;
				});
			}
		}
	}

	$: if ($rerender > 0) {
		const newLayer = new ArcLayer({
			data: loadData(), // @ts-ignore
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
			updatedLayers.push({
				id: id,
				layer: newLayer
			});
			return updatedLayers;
		});
	}

	const handleFromLatitude = (e: CustomEvent) => {
		fromLatitude = e.detail.column;
	};

	const handleFromLongitude = (e: CustomEvent) => {
		fromLongitude = e.detail.column;
	};

	const handleToLatitude = (e: CustomEvent) => {
		toLatitude = e.detail.column;
	};

	const handleToLongitude = (e: CustomEvent) => {
		toLongitude = e.detail.column;
	};
</script>

<div {id}>
	<input type="range" bind:value={getWidth} min="1" max="50" step="0.5" title="Change Width" />
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>

	<ColumnDropdown columnType="fromLatitude" on:choose={handleFromLatitude} />
	<ColumnDropdown columnType="fromLongitude" on:choose={handleFromLongitude} />
	<ColumnDropdown columnType="fromLongitude" on:choose={handleToLatitude} />
	<ColumnDropdown columnType="fromLongitude" on:choose={handleToLongitude} />
</div>
