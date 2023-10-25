<script lang="ts">
	import { ArcLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

	$: i = clickedChartIndex();
	let getWidth = 12;
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
			// Check if a layer with the same id exists, then remove it
			const layerID = newLayer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);

			// Add the new ArcLayer
			updatedLayers.push(newLayer);

			return updatedLayers;
		});
	}
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
