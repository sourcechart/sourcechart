<script>
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { layers } from '$lib/io/Stores';

	let elevationScale = 20;
	let extruded = true;
	let filled = true;
	let wireframe = false;
	let pickable = true;

	export let data;

	$: {
		const layer = new H3HexagonLayer({
			id: 'H3HexagonLayer',

			/* props from H3HexagonLayer class */

			elevationScale: elevationScale,
			extruded: extruded,
			filled: filled, // @ts-ignore
			getElevation: (d) => d.count, // @ts-ignore
			getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0], // @ts-ignore
			getHexagon: (d) => d.hex, // @ts-ignore

			wireframe: wireframe,
			pickable: pickable
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
