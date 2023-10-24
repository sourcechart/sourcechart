<script>
	import { ArcLayer } from '@deck.gl/layers';
	import { generateID } from '$lib/io/GenerateID';
	import { layers } from '$lib/io/Stores';
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
			getTargetPosition: (d) => d.to.coordinates,
			getWidth: 12,
			pickable: true
		});
		layers.update((layers) => [...layers, newLayer]);
	}
</script>
