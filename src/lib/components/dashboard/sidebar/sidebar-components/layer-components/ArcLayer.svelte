<script>
	import { ArcLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers } from '$lib/io/Stores';

	let getWidth = 12;
	let pickable = true;

	$: {
		const newLayer = new ArcLayer({
			id: generateID(),
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
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
