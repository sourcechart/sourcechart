<script lang="ts">
	import { canvasBehavior } from '$lib/io/Stores';
	import { onMount } from 'svelte';
	import { drawEraserTrail, drawArrow } from '../draw-utils/Draw';
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

	const doLinesIntersect = (a1: Point, a2: Point, b1: Point, b2: Point): boolean => {
		const crossProduct = (point1: Point, point2: Point, point3: Point) => {
			return (
				(point2.x - point1.x) * (point3.y - point1.y) -
				(point2.y - point1.y) * (point3.x - point1.x)
			);
		};

		const isPointOnSegment = (point1: Point, point2: Point, point: Point) => {
			return (
				point.x >= Math.min(point1.x, point2.x) &&
				point.x <= Math.max(point1.x, point2.x) &&
				point.y >= Math.min(point1.y, point2.y) &&
				point.y <= Math.max(point1.y, point2.y)
			);
		};

		const d1 = crossProduct(a1, a2, b1);
		const d2 = crossProduct(a1, a2, b2);
		const d3 = crossProduct(b1, b2, a1);
		const d4 = crossProduct(b1, b2, a2);

		// If d1 and d2 have opposite signs and d3 and d4 have opposite signs
		if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
			return true;
		}

		// Special cases where the endpoints are touching
		if (d1 === 0 && isPointOnSegment(a1, a2, b1)) return true;
		if (d2 === 0 && isPointOnSegment(a1, a2, b2)) return true;
		if (d3 === 0 && isPointOnSegment(b1, b2, a1)) return true;
		if (d4 === 0 && isPointOnSegment(b1, b2, a2)) return true;

		return false;
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
				drawArrowhead(startX, startY, e.clientX, e.clientY);
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
