<script>
	import { PolygonLayer } from '@deck.gl/geo-layers';
	import { layers } from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';

	function addPolygonLayer() {
		const newLayer = new PolygonLayer({
			id: generateID(),
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf-zipcodes.json',

			/* props from PolygonLayer class */

			// elevationScale: 1,
			extruded: true,
			filled: true,
			//@ts-ignore

			getElevation: (d) => d.population / d.area / 10,
			//@ts-ignore

			getFillColor: (d) => [d.population / d.area / 60, 140, 0],
			getLineColor: [80, 80, 80],
			//@ts-ignore

			getLineWidth: (d) => 1,

			//@ts-ignore
			getPolygon: (d) => d.contour,
			// lineJointRounded: false,
			// lineMiterLimit: 4,
			// lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
			lineWidthMinPixels: 1,
			// lineWidthScale: 1,
			// lineWidthUnits: 'meters',
			// material: true,
			stroked: true,
			wireframe: true,

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
