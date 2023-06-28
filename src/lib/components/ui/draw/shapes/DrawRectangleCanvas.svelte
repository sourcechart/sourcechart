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

	$: console.log($mouseEventState);

	const handleMouseDown = (e: MouseEvent) => {
		if ($mouseEventState === 'isTranslating' && $navBarState === 'select') {
			offsetX = e.clientX - polygon.vertices[0].x;
			offsetY = e.clientY - polygon.vertices[0].y;
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if ($mouseEventState === 'isTranslating' && $navBarState === 'select') {
			let newX = e.clientX - offsetX;
			let newY = e.clientY - offsetY;
			let width = polygon.vertices[2].x - polygon.vertices[0].x;
			let height = polygon.vertices[2].y - polygon.vertices[0].y;

			polygon = {
				...polygon,
				vertices: [
					{ x: newX, y: newY },
					{ x: newX + width, y: newY },
					{ x: newX + width, y: newY + height },
					{ x: newX, y: newY + height }
				]
			};
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
			context.strokeStyle = 'red';
			context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before redraw
			context.strokeRect(0, 0, 10, 10); // Now rectangle starts from (0,0) as it's drawn on its own canvas

			console.log(canvas.width, canvas.height, rectHeight, rectWidth);
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
