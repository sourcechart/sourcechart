<script>
	import { TripsLayer } from '@deck.gl/geo-layers';
	import { layers } from '$lib/io/Stores';
	function addTripsLayer() {
		const layer = new TripsLayer({
			id: 'TripsLayer',
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/sf.trips.json',

			/* props from TripsLayer class */

			currentTime: 500,
			// fadeTrail: true,
			//@ts-ignore
			getTimestamps: (d) => d.waypoints.map((p) => p.timestamp - 1554772579000),
			trailLength: 600,

			/* props inherited from PathLayer class */

			// billboard: false,
			capRounded: true,
			getColor: [253, 128, 93],
			//@ts-ignore

			getPath: (d) => d.waypoints.map((p) => p.coordinates),
			// getWidth: 1,
			jointRounded: true,
			// miterLimit: 4,
			// rounded: true,
			// widthMaxPixels: Number.MAX_SAFE_INTEGER,
			widthMinPixels: 8,
			// widthScale: 1,
			// widthUnits: 'meters',

			/* props inherited from Layer class */

			// autoHighlight: false,
			// coordinateOrigin: [0, 0, 0],
			// coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
			// highlightColor: [0, 0, 128, 128],
			// modelMatrix: null,
			opacity: 0.8
			// pickable: false,
			// visible: true,
			// wrapLongitude: false,
		});
		layers.update((layers) => [...layers, layer]);
	}
</script>
