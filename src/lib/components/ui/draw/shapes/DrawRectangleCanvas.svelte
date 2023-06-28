<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { mouseEventState, navBarState } from '$lib/io/Stores';

	export let polygon: Polygon;

	export let highlightcolor: string;
	export let defaultcolor: string;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX = 0;
	let offsetY = 0;

	const handleMouseDown = (e: MouseEvent) => {
		offsetX = e.clientX - polygon.vertices[0].x;
		offsetY = e.clientY - polygon.vertices[0].y;
	};

	const handleMouseMove = (e: MouseEvent) => {
		if ($mouseEventState === 'isTouching') {
			polygon.vertices[0].x = e.clientX - offsetX;
			polygon.vertices[0].y = e.clientY - offsetY;
			polygon.vertices[2].x = e.clientX - offsetX + canvas.width;
			polygon.vertices[2].y = e.clientY - offsetY + canvas.height;
		}
	};

	const handleMouseUp = () => {
		mouseEventState.set('isHovering');
	};

	afterUpdate(() => {
		// Set canvas width and height based on the polygon dimensions
		let startX = Math.min(polygon.vertices[0].x, polygon.vertices[2].x);
		let startY = Math.min(polygon.vertices[0].y, polygon.vertices[2].y);
		let endX = Math.max(polygon.vertices[0].x, polygon.vertices[2].x);
		let endY = Math.max(polygon.vertices[0].y, polygon.vertices[2].y);

		canvas.width = Math.abs(endX - startX);
		canvas.height = Math.abs(endY - startY);

		context = canvas.getContext('2d');

		if (context) {
			let rectWidth = Math.abs(endX - startX);
			let rectHeight = Math.abs(endY - startY);
			context.strokeStyle =
				$mouseEventState === 'isTouching' && $navBarState === 'drawRectangle'
					? defaultcolor
					: highlightcolor;
			context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before redraw
			context.strokeRect(0, 0, rectWidth, rectHeight); // Now rectangle starts from (0,0) as it's drawn on its own canvas
		}
	});
</script>

<div
	id={polygon.id}
	style="position: absolute; left: {polygon.vertices[0].x}px; top: {polygon.vertices[0].y}px;"
>
	<canvas
		bind:this={canvas}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
	/>
</div>
