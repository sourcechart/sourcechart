<script>
	import { LineLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers } from '$lib/io/Stores';

	let width = 12;
	let pickable = true;

	$: {
		const newLayer = new LineLayer({
			id: generateID(),
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',

			/* props from LineLayer class */
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
