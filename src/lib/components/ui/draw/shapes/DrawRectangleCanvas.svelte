<script lang="ts">
	import { onMount } from 'svelte';

	export let polygon: Polygon;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	onMount(() => {
		context = canvas.getContext('2d');
		// draw your rectangle here using the rectangle data
	});
</script>

<div id={polygon.id}>
	<canvas bind:this={canvas} width={polygon.width} height={polygon.height} />
</div>
