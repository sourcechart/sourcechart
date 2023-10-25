<script>
	import { PolygonLayer } from '@deck.gl/layers';
	import { layers } from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';

	let extruded = true;
	let filled = true;
	let lineColor = [80, 80, 80];
	let lineWidthMinPixels = 1;
	let stroked = true;
	let wireframe = true;
	let pickable = true;

	$: {
		const newLayer = new PolygonLayer({
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json',
			extruded: extruded,
			filled: filled, // @ts-ignore
			getElevation: (d) => d.population / d.area / 10, // @ts-ignore
			getFillColor: (d) => [d.population / d.area / 60, 140, 0], // @ts-ignore
			getLineColor: lineColor, // @ts-ignore
			getLineWidth: (d) => 1, // @ts-ignore
			getPolygon: (d) => d.contour,
			lineWidthMinPixels: lineWidthMinPixels,
			stroked: stroked,
			wireframe: wireframe,
			pickable: pickable
		});

		layers.update((currentLayers) => {
			// Remove the old PolygonLayer (if it exists with the same id)
			let updatedLayers = currentLayers.filter((layer) => layer.id !== newLayer.id);

			// Add the new PolygonLayer
			updatedLayers.push(newLayer);

			return updatedLayers;
		});
	}
</script>

<div>Polygon Layer</div>

<!-- Input controls to modify properties of the PolygonLayer -->
<div>
	<input type="checkbox" bind:checked={extruded} /> Extruded
	<input type="checkbox" bind:checked={filled} /> Filled
	<input type="color" bind:value={lineColor} title="Change Line Color" />
	<input
		type="range"
		bind:value={lineWidthMinPixels}
		min="1"
		max="10"
		step="0.5"
		title="Change Line Width Min Pixels"
	/>
	<input type="checkbox" bind:checked={stroked} /> Stroked
	<input type="checkbox" bind:checked={wireframe} /> Wireframe
	<input type="checkbox" bind:checked={pickable} /> Pickable
</div>
