<script lang="ts">
	import { canvasBehavior } from '$lib/io/Stores';
	import { onMount } from 'svelte';
	import { drawEraserTrail } from '../draw-utils/Draw';
	import { doLinesIntersect } from '../draw-utils/PolygonOperations';
	import { rough } from '$lib/components/ui/roughjs/rough';

	let roughCanvas: any;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];
	let CANVASBEHAVIOR = canvasBehavior();

	let isDragging = false;
	let handlesActivated = false;
	let draggingArrowIndex: number | null = null;

	let arrows: {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
		midX: number;
		midY: number;
	}[] = [];

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
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			// cleanup
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const handleMouseStart = (e: MouseEvent) => {
		startX = e.clientX;
		startY = e.clientY;

		for (let i = 0; i < arrows.length; i++) {
			let arrow = arrows[i];
			const distanceToLine = pointToLineDistance(
				e.clientX,
				e.clientY,
				arrow.startX,
				arrow.startY,
				arrow.endX,
				arrow.endY
			);

			if (distanceToLine < 10) {
				isDragging = true;
				handlesActivated = true;
				draggingArrowIndex = i;
				break;
			} else {
				handlesActivated = true;
			}
		}
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
				drawEraserTrail(eraserTrail, context, '#433f3f50', 6);
				eraseIntersectingArrows(); // <-- Add this here
			} else if ($CANVASBEHAVIOR === 'isDrawingArrow') {
				drawArrowhead(startX, startY, e.clientX, e.clientY);
			}
		}

		if (isDragging && draggingArrowIndex !== null) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			arrows[draggingArrowIndex].startX += deltaX;
			arrows[draggingArrowIndex].startY += deltaY;
			arrows[draggingArrowIndex].endX += deltaX;
			arrows[draggingArrowIndex].endY += deltaY;
			arrows[draggingArrowIndex].midX += deltaX;
			arrows[draggingArrowIndex].midY += deltaY;

			startX = e.clientX;
			startY = e.clientY;

			redrawArrows();
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		if ($CANVASBEHAVIOR === 'isDrawingArrow') {
			arrows = [
				...arrows,
				{
					startX,
					startY,
					endX: e.clientX,
					endY: e.clientY,
					midX: (e.clientX + startX) / 2,
					midY: (e.clientY + startY) / 2
				}
			];
		}
		if (context) {
			eraserTrail = [];
			context.clearRect(0, 0, width, height);
			redrawArrows();
		}

		if (isDragging) {
			isDragging = false;
			draggingArrowIndex = null;
		}
	};

	const eraseIntersectingArrows = () => {
		for (let i = 0; i < eraserTrail.length - 1; i++) {
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

	function pointToLineDistance(
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number
	): number {
		const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
		const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

		return numerator / denominator;
	}

	const redrawArrows = () => {
		for (let arrow of arrows) {
			drawArrowhead(arrow.startX, arrow.startY, arrow.endX, arrow.endY);
		}
	};

	const drawArrowhead = (startX: number, startY: number, endX: number, endY: number) => {
		const angle = Math.atan2(endY - startY, endX - startX);

		const length = 15; // The length of the arrowhead lines
		const headAngle = Math.PI / 7; // Angle for the arrowhead. Adjust for sharper/narrower arrowheads

		const x1 = endX - length * Math.cos(angle - headAngle);
		const y1 = endY - length * Math.sin(angle - headAngle);
		const x2 = endX - length * Math.cos(angle + headAngle);
		const y2 = endY - length * Math.sin(angle + headAngle);

		roughCanvas.line(startX, startY, endX, endY, {
			stroke: 'white',
			strokeWidth: strokeWidth,
			roughness: roughness
		});

		roughCanvas.path(`M ${endX} ${endY} L ${x1} ${y1} M ${endX} ${endY} L ${x2} ${y2}`, {
			stroke: 'white',
			strokeWidth: strokeWidth,
			roughness: roughness
		});
	};
</script>

<div
	class="absolute h-full w-full"
	on:mousedown={handleMouseStart}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
>
	<canvas style="position: fixed; z-index: 1;" bind:this={canvas} />
	<svg viewBox={`0 0 ${width} ${height}`} style="position: absolute;  top: 0; left: 0; z-index: 1;">
		{#if handlesActivated}
			{#each arrows as arrow}
				<circle
					cx={arrow.startX}
					cy={arrow.startY}
					r="5"
					stroke="red"
					stroke-width="1"
					fill="transparent"
				/>
				<!--
				<circle
					cx={arrow.midX}
					cy={arrow.midY}
					r="5"
					stroke="red"
					stroke-width="1"
					fill="transparent"
				/>
				-->
				<circle
					cx={arrow.endX}
					cy={arrow.endY}
					r="5"
					stroke="red"
					stroke-width="1"
					fill="transparent"
				/>
			{/each}
		{/if}
	</svg>
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
