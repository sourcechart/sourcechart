<script lang="ts">
	import {
		ArcLayer,
		PolygonLayer,
		PointCloudLayer,
		PathLayer,
		LineLayer,
		TextLayer,
		IconLayer
	} from '@deck.gl/layers';

	import { layers } from '$lib/io/Stores';

	$: console.log($layers);

	let currentLayer: string = 'Select Layer';
	let deckGlLayers = [
		{
			name: 'PolygonLayer',
			component: PolygonLayer
		},
		{
			name: 'PointCloudLayer',
			component: PointCloudLayer
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
			name: 'TextLayer',
			component: TextLayer
		},
		{
			name: 'IconLayer',
			component: IconLayer
		}
	];

	function addTextLayer() {
		const newLayer = new TextLayer({
			id: 'base-map',
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
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addArcLayer() {
		const newLayer = new ArcLayer({
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addTripLayer() {
		const newLayer = new ArcLayer({
			id: 'base-map',
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
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});

		layers.update((layers) => [...layers, newLayer]);
	}

	function addPointCloudLayer() {
		const newLayer = new PointCloudLayer({
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addPathLayer() {
		const newLayer = new PathLayer({
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function addLineLayer() {
		const newLayer = new LineLayer({
			id: 'base-map',
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.update((layers) => [...layers, newLayer]);
	}

	function selectLayer(layerName: string) {
		currentLayer = layerName;
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
			case 'PointCloudLayer':
				addPointCloudLayer();
				break;
			case 'PathLayer':
				addPathLayer();
				break;
			case 'LineLayer':
				addLineLayer();
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
