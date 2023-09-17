<script lang="ts">
	import { canvasBehavior } from '$lib/io/Stores';
	import { onMount } from 'svelte';
	import { drawEraserTrail, drawArrowhead } from '../draw-utils/Draw';
	import { doLinesIntersect } from '../draw-utils/PolygonOperations';
	import rough from 'roughjs/bin/rough';

	let roughCanvas: any;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];
	let CANVASBEHAVIOR = canvasBehavior();

	let arrows: { startX: number; startY: number; endX: number; endY: number }[] = [];

	let offsetX: number = 0;
	let offsetY: number = 0;

	let startX: number = 0;
	let startY: number = 0;
	const MAX_TRAIL_LENGTH = 7;

	let roughness = 0.8;
	let strokeWidth = 1;

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

	const handleMouseStart = (e: MouseEvent) => {
		startX = e.clientX;
		startY = e.clientY;
	};

	const handleMouseMove = (e: MouseEvent) => {
		eraserTrail = [...eraserTrail, { x: e.clientX, y: e.clientY }];

		while (eraserTrail.length > MAX_TRAIL_LENGTH) {
			eraserTrail.shift();
		}

		if (context) {
			context.clearRect(0, 0, width, height);
			redrawArrows(); // Redraw arrows from the list
			if ($CANVASBEHAVIOR === 'isErasing') {
				drawEraserTrail(eraserTrail, context, '#433f3f50', 4);
				eraseIntersectingArrows(); // <-- Add this here
			} else if ($CANVASBEHAVIOR === 'isDrawingArrow') {
				drawArrowhead(roughCanvas, 0.9, 0.8, startX, startY, e.clientX, e.clientY);
			}
		}
	};
	const handleMouseUp = (e: MouseEvent) => {
		if ($CANVASBEHAVIOR === 'isDrawingArrow') {
			arrows.push({ startX, startY, endX: e.clientX, endY: e.clientY });
		}
		if ($CANVASBEHAVIOR !== ('isErasing' || 'isDrawingArrow')) return;
		if (context) {
			eraserTrail = [];
			context.clearRect(0, 0, width, height);
			redrawArrows();
		}
	};

	const eraseIntersectingArrows = () => {
		// Debug

		// For each segment of the eraserTrail
		for (let i = 0; i < eraserTrail.length - 1; i++) {
			// For each arrow
			for (let j = arrows.length - 1; j >= 0; j--) {
				const arrow = arrows[j];
				if (
					doLinesIntersect(
						{ x: arrow.startX, y: arrow.startY },
						{ x: arrow.endX, y: arrow.endY },
						eraserTrail[0],
						eraserTrail[eraserTrail.length - 1]
					)
				) {
					arrows.splice(j, 1); // Remove the arrow if intersecting
				}
			}
		}
	};

	const redrawArrows = () => {
		for (let arrow of arrows) {
			drawArrowhead(roughCanvas, 0.9, 0.8, arrow.startX, arrow.startY, arrow.endX, arrow.endY);
		}
	};
</script>

<div
	class="absolute h-full w-full"
	on:mousedown={handleMouseStart}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
>
	<canvas style="position: absolute; z-index: 10000;" bind:this={canvas} />
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
