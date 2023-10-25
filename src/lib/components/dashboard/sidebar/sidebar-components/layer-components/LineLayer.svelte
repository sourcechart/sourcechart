<script lang="ts">
	import { LineLayer } from '@deck.gl/layers';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

	let width = 12;
	let pickable = true;

	$: i = clickedChartIndex();
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
		const newLayer = new LineLayer({
			data: loadData(),
			// @ts-ignore
			getColor: (d) => [Math.sqrt(d.inbound + d.outbound), 140, 0], // @ts-ignore
			getSourcePosition: (d) => d.from.coordinates, // @ts-ignore
			getTargetPosition: (d) => d.to.coordinates,
			getWidth: width,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			// Check if a layer with the same id exists, then remove it
			const layerID = newLayer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);

			// Add the new LineLayer
			updatedLayers.push(newLayer);

			return updatedLayers;
		});
	}
</script>

<div>Line Layer</div>

<!-- Input controls to modify properties of the LineLayer -->
<div>
	<input type="range" bind:value={width} min="1" max="30" step="0.5" title="Change Width" />
	<label>
		<input type="checkbox" bind:checked={pickable} />
		Pickable
	</label>
</div>
