<script lang="ts">
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';
	import { layers, mostRecentChartID } from '$lib/io/Stores';
	import { GeoJsonLayer } from '@deck.gl/layers';
	import { onDestroy, onMount } from 'svelte';
	import { Deck } from '@deck.gl/core';

	export let dataUrl: string =
		'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

	let deckInstance: any;
	let container: HTMLElement;

	onDestroy(() => {
		deckInstance && deckInstance.finalize();
	});

	onMount(() => {
		var id = 'base-map';
		addChartMetaData(id);
		mostRecentChartID.set(id);
		const geojsonLayer = new GeoJsonLayer({
			data: dataUrl,
			stroked: true,
			filled: true,
			lineWidthMinPixels: 2,
			opacity: 0.4,
			getLineColor: [60, 60, 60],
			getFillColor: [200, 200, 200]
		});
		layers.set([{ id: 'geojson', layer: geojsonLayer }]);
	});

	$: if (container) {
		const INITIAL_VIEW_STATE = {
			longitude: -74,
			latitude: 40.7,
			zoom: 4,
			maxZoom: 16,
			pitch: 0,
			bearing: 0
		};

		new Deck({
			initialViewState: INITIAL_VIEW_STATE,
			controller: true,
			layers: $layers.filter((l) => l.layer).map((l) => l.layer)
		});
	}
</script>

<div bind:this={container} style="width: 100%; height: 100%;" />
