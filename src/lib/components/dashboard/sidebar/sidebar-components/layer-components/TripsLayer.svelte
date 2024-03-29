<script lang="ts">
	import {
		rerender,
		layers,
		allCharts,
		getColumnsFromFile,
		clickedChartIndex,
		duckDBInstanceStore
	} from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';
	import { TripsLayer } from '@deck.gl/geo-layers';
	import Dropdown from '../utils/Dropdown.svelte';

	$: columns = getColumnsFromFile();
	$: i = clickedChartIndex();

	export let id: string;

	let currentTime = 500;
	let trailLength = 600;
	let capRounded = true;
	let color = [253, 128, 93];
	let widthMinPixels = 8;
	let opacity = 0.8;

	async function* transformRows(rows: AsyncIterable<any>) {
		for await (const row of rows) {
			const obj: any = {
				from: {
					coordinates: [row.from_longitude, row.from_latitude]
				},
				to: {
					coordinates: [row.to_longitude, row.to_latitude]
				},
				inbound: row.inbound,
				outbound: row.outbound
			};
			yield obj;
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
		const layer = new TripsLayer({
			id: id,
			data: loadData(),
			currentTime: currentTime, // @ts-ignore
			getTimestamps: (d) => d.waypoints.map((p) => p.timestamp - 1554772579000),
			trailLength: trailLength,

			capRounded: capRounded,
			getColor: color, // @ts-ignore
			getPath: (d) => d.waypoints.map((p) => p.coordinates),
			jointRounded: true,
			widthMinPixels: widthMinPixels,
			opacity: opacity
		});

		layers.update((currentLayers) => {
			currentLayers.push({ id: id, layer: layer });
			return currentLayers;
		});
	}
</script>

<div>Trips Layer</div>

<div>
	<input
		type="range"
		bind:value={currentTime}
		min="0"
		max="1000"
		step="10"
		title="Change Current Time"
	/>
	<input
		type="range"
		bind:value={trailLength}
		min="100"
		max="1000"
		step="10"
		title="Change Trail Length"
	/>
	<input type="color" bind:value={color} title="Change Color" />
	<input
		type="range"
		bind:value={widthMinPixels}
		min="1"
		max="20"
		step="0.5"
		title="Change Width Min Pixels"
	/>
	<input type="range" bind:value={opacity} min="0" max="1" step="0.1" title="Change Opacity" />
</div>

<Dropdown columnType="startPoint" items={$columns} on:choose={() => {}} />
<Dropdown columnType="endPoint" items={$columns} on:choose={() => {}} />
