<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Deck } from '@deck.gl/core';
	import { GeoJsonLayer } from '@deck.gl/layers';
	import { layers, layers as layersStore, mostRecentChartID } from '$lib/io/Stores';
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';

	export let dataUrl: string =
		'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

	let deckInstance: any;
	let container: HTMLElement;

	onDestroy(() => {
		deckInstance && deckInstance.finalize();
	});

	onMount(() => {
		var id = 'map';
		addChartMetaData(id);
		mostRecentChartID.set(id);
		layersStore.set([
			new GeoJsonLayer({
				id: 'base-map',
				data: dataUrl,
				stroked: true,
				filled: true,
				lineWidthMinPixels: 2,
				opacity: 0.4,
				getLineColor: [60, 60, 60],
				getFillColor: [200, 200, 200]
			})
		]);
	});

	$: if (container) {
		const INITIAL_VIEW_STATE = {
			latitude: 37.8,
			longitude: -122.45,
			zoom: 15,
			bearing: 0,
			pitch: 0
		};

		deckInstance = new Deck({
			initialViewState: INITIAL_VIEW_STATE,
			controller: true,
			layers: $layers
		});
	}
</script>

<div bind:this={container} style="width: 100%; height: 100%;" />
