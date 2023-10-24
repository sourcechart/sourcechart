<script lang="ts">
	import {
		ArcLayer,
		PolygonLayer,
		PathLayer,
		LineLayer,
		TextLayer,
		ScatterplotLayer,
		IconLayer
		//TripsLayer
	} from '@deck.gl/layers';
	import { TripsLayer } from '@deck.gl/geo-layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers } from '$lib/io/Stores';

	let currentLayer: string = 'Select Layer';
	let deckGlLayers = [
		{
			name: 'PolygonLayer',
			component: PolygonLayer
		},

		{
			name: 'PathLayer',
			component: PathLayer
		},
		{
			name: 'ArcLayer',
			component: ArcLayer
		},
		{
			name: 'LineLayer',
			component: LineLayer
		},

		{
			name: 'ScatterplotLayer',
			component: ScatterplotLayer
		},
		{
			name: 'TripsLayer',
			component: TripsLayer
		}
	];

	function addTextLayer() {
		const newLayer = new TextLayer({
			id: generateID(),
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addIconLayer() {
		const newLayer = new IconLayer({
			id: generateID(),
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

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

	function addArcLayer() {
		const newLayer = new ArcLayer({
			id: generateID(),
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-segments.json',
			//@ts-ignore

			getSourceColor: (d) => [Math.sqrt(d.inbound), 140, 0],
			//@ts-ignore

			getSourcePosition: (d) => d.from.coordinates,
			//@ts-ignore

			getTargetColor: (d) => [Math.sqrt(d.outbound), 140, 0],
			//@ts-ignore

			getTargetPosition: (d) => d.to.coordinates,
			// getTilt: 0,
			getWidth: 12,
			// greatCircle: false,
			// numSegments: 50,
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
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addTripLayer() {
		const newLayer = new ArcLayer({
			id: generateID(),
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

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

	function addPathLayer() {
		const newLayer = new PathLayer({
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-lines.json',

			/* props from PathLayer class */

			// billboard: false,
			// capRounded: false,
			//@ts-ignore

			getColor: (d) => {
				const hex = d.color;
				return hex.match(/[0-9a-f]{2}/g).map((x: string) => parseInt(x, 16));
			},
			//@ts-ignore

			getPath: (d) => d.path,
			//@ts-ignore

			getWidth: (d) => 5,
			// jointRounded: false,
			// miterLimit: 4,
			// widthMaxPixels: Number.MAX_SAFE_INTEGER,
			widthMinPixels: 2,
			widthScale: 20,
			// widthUnits: 'meters',

			/* props inherited from Layer class */

			// autoHighlight: false,
			// coordinateOrigin: [0, 0, 0],
			// coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
			// highlightColor: [0, 0, 128, 128],
			// modelMatrix: null,
			// opacity: 1,
			parameters: {
				depthMask: false
			},
			pickable: true
			// visible: true,
			// wrapLongitude: false,
		});
		layers.update((layers) => [...layers, newLayer]);
	}

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

	function addScatterplotLayer() {
		const newLayer = new ScatterplotLayer({
			id: generateID(),

			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',

			/* props from ScatterplotLayer class */

			// antialiasing: true,
			// billboard: false,
			// filled: true,
			getFillColor: [255, 140, 0],
			getLineColor: [0, 0, 0],
			// getLineWidth: 1,
			//@ts-ignore

			getPosition: (d) => d.coordinates,
			//@ts-ignore

			getRadius: (d) => Math.sqrt(d.exits),
			// lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
			lineWidthMinPixels: 1,
			// lineWidthScale: 1,
			// lineWidthUnits: 'meters',
			radiusMaxPixels: 100,
			radiusMinPixels: 1,
			radiusScale: 6,
			// radiusUnits: 'meters',
			stroked: true,

			/* props inherited from Layer class */

			// autoHighlight: false,
			// coordinateOrigin: [0, 0, 0],
			// coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
			// highlightColor: [0, 0, 128, 128],
			// modelMatrix: null,
			opacity: 0.8,
			pickable: true
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function selectLayer(layerName: string) {
		currentLayer = layerName;
		isDropdownOpen = false;
		switch (layerName) {
			case 'TextLayer':
				addTextLayer();
				break;

			case 'IconLayer':
				addIconLayer();
				break;

			case 'ArcLayer':
				addArcLayer();
				break;

			case 'TripLayer':
				addTripLayer();
				break;

			case 'PolygonLayer':
				addPolygonLayer();
				break;

			case 'TripsLayer':
				addTripsLayer();
				break;

			case 'PathLayer':
				addPathLayer();
				break;

			case 'LineLayer':
				addLineLayer();
				break;
			case 'ScatterplotLayer':
				addScatterplotLayer();
				break;

			default:
				console.error('Unknown layer type:', layerName);
		}
	}

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}
</script>

<button
	class="w-full py-1 ml-2 rounded-sm bg-neutral-900 hover:bg-neutral-900/50 text-sm font-thin text-gray-100"
	on:click={toggleDropdown}
>
	{currentLayer}
</button>
<div>
	{#if isDropdownOpen}
		<div
			class="w-48 top-0 absolute left-12 ml-2 mt-72 bg-neutral-900 rounded-md h-48 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 scrollBarDiv"
		>
			{#each deckGlLayers as layer (layer.name)}
				<button
					class="w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300"
					on:click={() => selectLayer(layer.name)}
				>
					{layer.name}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}
</style>
