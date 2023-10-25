<script lang="ts">
	import { PathLayer } from '@deck.gl/layers';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

	$: i = clickedChartIndex();
	let widthMinPixels = 2;
	let widthScale = 20;
	let pickable = true;

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

	$: {
		const layer = new PathLayer({
			data: loadData(),
			// @ts-ignore
			getColor: (d) => {
				const hex = d.color;
				// @ts-ignore
				return hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16));
			}, // @ts-ignore
			getPath: (d) => d.path, // @ts-ignore
			getWidth: (d) => 5,
			widthMinPixels: widthMinPixels,
			widthScale: widthScale,
			parameters: {
				depthMask: false
			},
			pickable: pickable
		});

		layers.update((currentLayers) => {
			const layerID = layer.id;
			let updatedLayers = currentLayers.filter((l) => l.id !== layerID);
			updatedLayers.push(layer);
			return updatedLayers;
		});
	}
</script>

<div>Path Layer</div>

<!-- Input controls to modify properties of the PathLayer -->
<div>
	<input
		type="range"
		bind:value={widthMinPixels}
		min="1"
		max="50"
		step="0.5"
		title="Change Width Min Pixels"
	/>
	<input
		type="range"
		bind:value={widthScale}
		min="1"
		max="100"
		step="1"
		title="Change Width Scale"
	/>
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>
