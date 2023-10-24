<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Deck } from '@deck.gl/core';
	import { GeoJsonLayer } from '@deck.gl/layers';

	export let dataUrl: string =
		'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson';

	let deckInstance: any;
	let container: HTMLElement;

	onDestroy(() => {
		deckInstance && deckInstance.finalize();
	});

	$: if (container) {
		const INITIAL_VIEW_STATE = {
			latitude: 51.47,
			longitude: 0.45,
			zoom: 4,
			bearing: 0,
			pitch: 0
		};

		deckInstance = new Deck({
			initialViewState: INITIAL_VIEW_STATE,
			controller: true,
			layers: [
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
			]
		});
	}
</script>

<div bind:this={container} style="width: 100%; height: 100%;" />
