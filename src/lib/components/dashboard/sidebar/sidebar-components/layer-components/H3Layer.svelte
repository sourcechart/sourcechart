<script>
	import { H3HexagonLayer } from '@deck.gl/geo-layers';
	import { layers } from '$lib/io/Stores';

	function addH3Layer() {
		const layer = new H3HexagonLayer({
			id: 'H3HexagonLayer',
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.h3cells.json',

			/* props from H3HexagonLayer class */

			// centerHexagon: null,
			// coverage: 1,
			elevationScale: 20,
			extruded: true,
			filled: true,

			//@ts-ignore
			getElevation: (d) => d.count,
			//@ts-ignore
			getFillColor: (d) => [255, (1 - d.count / 500) * 255, 0],
			//@ts-ignore
			getHexagon: (d) => d.hex,
			// getLineColor: [0, 0, 0, 255],
			// getLineWidth: 1,
			// highPrecision: 'auto',
			// lineJointRounded: false,
			// lineMiterLimit: 4,
			// lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
			// lineWidthMinPixels: 0,
			// lineWidthScale: 1,
			// lineWidthUnits: 'meters',
			// material: true,
			// stroked: true,
			wireframe: false,

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

		layers.update((layers) => [...layers, layer]);
	}
</script>
