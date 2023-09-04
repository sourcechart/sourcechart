<script lang="ts">
	import { touchStates } from '$lib/io/Stores';
	import { drawEraserTrail } from './draw-utils/Draw';
	import { afterUpdate } from 'svelte';

	export let eraserTrail: Point[];

	let offsetX = 0;
	let offsetY = 0;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	$: TOUCHSTATE = touchStates();

	const handleMouseDown = (e: MouseEvent) => {
		var x = e.clientX; // adjust the mouse x-coordinate by the left offset of the canvas
		var y = e.clientY;
	};

	const handleMouseMove = (e: MouseEvent) => {
		var x = e.clientX;
		var y = e.clientY;

		if ($TOUCHSTATE === 'isErasing') {
			var dx = x - offsetX;
			var dy = y - offsetY;
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		var x = e.clientX;
		var y = e.clientY;
		if ($TOUCHSTATE === 'isErasing') {
			var dx = x - offsetX;
			var dy = y - offsetY;
		}
	};

	afterUpdate(() => {
		context = canvas.getContext('2d');

		if (context) {
			context.strokeStyle = 'red';
			drawEraserTrail(eraserTrail, context, 'red');
		}
	});
</script>

<div
	class="absolute h-full w-full"
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
>
	<canvas style="position: absolute;  z-index: 2;" bind:this={canvas} />
</div>
