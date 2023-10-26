<script lang="ts">
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { layers, allCharts, clickedChartIndex, duckDBInstanceStore } from '$lib/io/Stores';
	import { checkNameForSpacesAndHyphens } from '$lib/io/FileUtils';

	$: i = clickedChartIndex();
	let elevationScale = 20;
	let extruded = true;
	let filled = true;
	let wireframe = false;
	let pickable = true;
	/**
	 * Data format:
	 * [
	 *   {
	 *     hex: '88283082b9fffff',
	 *     count: 96
	 *   },
	 *   ...
	 * ]
	 */

	const data = [];
	async function* transformRows(rows: AsyncIterable<any>) {
		for await (const row of rows) {
			const obj: any = {
				hex: row.hex,
				count: row.count
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
		console.log('triggered');
		const layer = new H3HexagonLayer({
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json',

			/* props from H3HexagonLayer class */

			// centerHexagon: null,
			// coverage: 1,
			elevationScale: 20,
			extruded: true,
			filled: true,
			getElevation: (d) => d.count,
			getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0],
			getHexagon: (d) => d.hex
		});

		layers.update((currentLayers) => {
			// Check if a layer with the same id exists, then remove it
			const layerID = layer.id;
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerID);

			// Add the new H3HexagonLayer
			updatedLayers.push(layer);

			return updatedLayers;
		});
	}
</script>

<div>H3 Layer</div>

<!-- Input controls to modify properties of the H3HexagonLayer -->
<div>
	<input
		type="range"
		bind:value={elevationScale}
		min="1"
		max="50"
		step="0.5"
		title="Change Elevation Scale"
	/>
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
</div>
