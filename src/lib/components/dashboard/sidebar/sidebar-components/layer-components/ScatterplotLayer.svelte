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
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json', // eslint-disable-line,
			radiusScale: 3,
			radiusMinPixels: 0.25, //@ts-ignore
			getPosition: (d) => [d[0], d[1], 0], //@ts-ignore
			getFillColor: (d) => (d[2] === 1 ? 'red' : 'blue'),
			getRadius: 1,
			updateTriggers: {
				getFillColor: ['red', 'blue']
			}
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
