<script>
	import { LineLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers } from '$lib/io/Stores';
	function addLineLayer() {
		const newLayer = new LineLayer({
			id: generateID(),
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',

			/* props from LineLayer class */

			//@ts-ignore
			getColor: (d) => [Math.sqrt(d.inbound + d.outbound), 140, 0],
			//@ts-ignore
			getSourcePosition: (d) => d.from.coordinates,
			//@ts-ignore
			getTargetPosition: (d) => d.to.coordinates,
			getWidth: 12,
			// widthMaxPixels: Number.MAX_SAFE_INTEGER,
			// widthMinPixels: 0,
			// widthScale: 1,
			// widthUnits: 'pixels',

			/* props inherited from Layer class */

			// autoHighlight: false,
			// coordinateOrigin: [0, 0, 0],
			// coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
			// highlightColor: [0, 0, 128, 128],
			// modelMatrix: null,
			// opacity: 1,
			pickable: true
			// visible: true,
			// wrapLongitude: false,
		});
		layers.update((layers) => [...layers, newLayer]);
	}
</script>
