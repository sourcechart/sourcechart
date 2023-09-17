<script lang="ts">
	import { canvasBehavior } from '$lib/io/Stores';
	import { onMount } from 'svelte';
	import { drawEraserTrail } from '../draw-utils/Draw';
	import rough from 'roughjs/bin/rough';

	let roughCanvas: any;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];
	let CANVASBEHAVIOR = canvasBehavior();

	let offsetX: number = 0;
	let offsetY: number = 0;

	let startX: number = 0;
	let startY: number = 0;
	const MAX_TRAIL_LENGTH = 5;

	$: console.log($CANVASBEHAVIOR);

	onMount(() => {
		context = canvas.getContext('2d');
		roughCanvas = rough.canvas(canvas);
		width = window.innerWidth;
		height = window.innerHeight;
		updateOffset();
		canvas.width = width;
		canvas.height = height;
	});

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const handleMouseMove = (e: MouseEvent) => {
		eraserTrail = [...eraserTrail, { x: e.clientX, y: e.clientY }];

		// If the trail length exceeds the max length, remove the oldest point
		while (eraserTrail.length > MAX_TRAIL_LENGTH) {
			eraserTrail.shift();
		}

		if (context) {
			// Clear the canvas
			context.clearRect(0, 0, width, height);
			// Draw the reduced trail on the cleared canvas
			if ($CANVASBEHAVIOR === 'isErasing') {
				drawEraserTrail(eraserTrail, context, '#433f3f50', 4);
			} else if ($CANVASBEHAVIOR === 'isDrawingArrow') {
				roughCanvas.line(0, 0, e.clientX, e.clientY, {
					stroke: 'white',
					strokeWidth: 0.5,
					roughness: 0.4
				});
			}
		}
	};

	const handleMouseUp = () => {
		if ($CANVASBEHAVIOR !== ('isErasing' || 'isDrawingArrow')) return;
		if (context) {
			eraserTrail = [];
			context.clearRect(0, 0, width, height);
		}
	};
</script>

<div class="absolute h-full w-full" on:mousemove={handleMouseMove} on:mouseup={handleMouseUp}>
	<canvas style="position: absolute;" bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
			if (canvas) {
				canvas.width = width;
				canvas.height = height;
			}
		}
	}}
/>
