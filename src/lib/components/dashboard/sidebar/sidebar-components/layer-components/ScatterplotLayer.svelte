<script>
	import { ScatterplotLayer } from '@deck.gl/layers';
	import { layers } from '$lib/io/Stores';

	let fillColor = [255, 140, 0];
	let lineColor = [0, 0, 0];
	let opacity = 0.8;
	let radiusScale = 6;
	let pickable = true;

	$: {
		const scatterLayer = new ScatterplotLayer({
			id: 'ScatterplotLayer',
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
			getFillColor: fillColor,
			getLineColor: lineColor, // @ts-ignore
			getPosition: (d) => d.coordinates, // @ts-ignore
			getRadius: (d) => Math.sqrt(d.exits),
			lineWidthMinPixels: 1,
			radiusMaxPixels: 100,
			radiusMinPixels: 1,
			radiusScale: radiusScale,
			stroked: true,
			opacity: opacity,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			let updatedLayers = currentLayers.filter((layer) => layer.id !== 'ScatterplotLayer');
			updatedLayers.push(scatterLayer);
			return updatedLayers;
		});
	}
</script>

<div>Scatter Plot Layer</div>

<!-- Input controls to modify properties of the ScatterplotLayer -->
<div>
	<input type="color" bind:value={fillColor} title="Change Fill Color" />
	<input type="color" bind:value={lineColor} title="Change Line Color" />
	<input type="range" bind:value={radiusScale} min="1" max="10" step="0.5" />
	<input type="range" bind:value={opacity} min="0" max="1" step="0.1" />
	<input type="checkbox" bind:checked={pickable} /> Pickable
</div>
