<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let polygon: Polygon;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	afterUpdate(() => {
		// Set canvas width and height based on the polygon dimensions
		let startX = polygon.vertices[0].x;
		let startY = polygon.vertices[0].y;
		let endX = polygon.vertices[2].x;
		let endY = polygon.vertices[2].y;

		canvas.width = Math.abs(endX - startX);
		canvas.height = Math.abs(endY - startY);

		context = canvas.getContext('2d');

		if (context) {
			let rectWidth = Math.abs(endX - startX);
			let rectHeight = Math.abs(endY - startY);
			context.strokeStyle = 'red';
			context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before redraw
			context.strokeRect(0, 0, rectWidth, rectHeight); // Now rectangle starts from (0,0) as it's drawn on its own canvas
		}
	});
</script>

<div
	id={polygon.id}
	style="position: absolute; left: {polygon.vertices[0].x}px; top: {polygon.vertices[0].y}px;"
	on:click={() => {
		console.log('foo');
	}}
	on:keypress={() => null}
>
	<canvas bind:this={canvas} />
</div>
