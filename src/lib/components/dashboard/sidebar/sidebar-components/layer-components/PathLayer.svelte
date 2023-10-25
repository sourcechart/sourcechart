<script>
	import { PathLayer } from '@deck.gl/layers';
	import { layers } from '$lib/io/Stores';

	let widthMinPixels = 2;
	let widthScale = 20;
	let pickable = true;

	$: {
		const layer = new PathLayer({
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json',
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
