<script lang="ts">
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';
	import { layers, mostRecentChartID } from '$lib/io/Stores';
	import { onDestroy, onMount } from 'svelte';
	import { Deck } from '@deck.gl/core';
	import mapboxgl from 'mapbox-gl';

	mapboxgl.accessToken =
		'pk.eyJ1IjoiYXJwZXJ5YW4iLCJhIjoiY2l4cTJkc2t6MDAzcjJxcG9maWp1ZmFjMCJ9.XT957ywrTABjNFqGdp_37g';
	let deckInstance: any;
	let map: mapboxgl.Map;
	let container: HTMLElement;

	let INITIAL_VIEW_STATE = {
		longitude: -74,
		latitude: 40.7,
		zoom: 4,
		maxZoom: 16,
		pitch: 0,
		bearing: 0
	};

	$: if (container) {
		const updatedLayers = $layers.filter((l) => l.layer).map((l) => l.layer);
		if (updatedLayers.length > 0) deckInstance.setProps({ layers: updatedLayers });
	}

	$: if (container) {
		const updatedLayers = $layers.filter((l) => l.layer).map((l) => l.layer);
		deckInstance.setProps({ layers: updatedLayers });
	}

	onMount(() => {
		var id = 'base-map';
		addChartMetaData(id);
		mostRecentChartID.set(id);

		map = new mapboxgl.Map({
			container: container,
			style: 'mapbox://styles/mapbox/navigation-night-v1',
			...INITIAL_VIEW_STATE
		});

		layers.set([]);

		deckInstance = new Deck({
			canvas: 'deck-canvas',
			width: '100%',
			height: '100%',
			initialViewState: INITIAL_VIEW_STATE,
			controller: true, //@ts-ignore
			onViewStateChange: ({ viewState }) => {
				map.jumpTo({
					center: [viewState.longitude, viewState.latitude],
					zoom: viewState.zoom,
					bearing: viewState.bearing,
					pitch: viewState.pitch
				});
			},
			layers: []
		});
	});

	onDestroy(() => {
		deckInstance && deckInstance.finalize();
		map && map.remove();
	});
</script>

<div bind:this={container} class="map-container" style="width: 100%; height: 100%;">
	<canvas id="deck-canvas" style="position: absolute;" />
</div>
