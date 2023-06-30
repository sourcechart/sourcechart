<script lang="ts">
	import { drawHandles, drawRectangle } from './draw-utils/Draw';
	import { mouseEventState, navBarState } from '$lib/io/Stores';
	import { isPointInPolygon } from './draw-utils/PolygonOperations';
	import { afterUpdate } from 'svelte';
	import Handle from './Handle.svelte';

	export let polygon: Polygon;

	export let highlightcolor: string;
	export let defaultcolor: string;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX = 0;
	let offsetY = 0;
	let rectWidth: number;
	let rectHeight: number;
	let handlePositions: Point[] = []; // new state variable for handle positions

	// DrawRectangle.svelte
	const handleMouseDown = (e: MouseEvent) => {
		let x = e.clientX;
		let y = e.clientY;
		let inPolygon = isPointInPolygon({ x, y }, polygon);
		if (inPolygon) {
			offsetX = x - polygon.vertices[0].x;
			offsetY = y - polygon.vertices[0].y;
		}
	};
	const handleMouseMove = (e: MouseEvent) => {
		let x = e.clientX;
		let y = e.clientY;
		let inPolygon = isPointInPolygon({ x, y }, polygon);
		if (inPolygon) {
			if ($mouseEventState === 'isTouching') {
				polygon.vertices[0].x = x - offsetX;
				polygon.vertices[0].y = y - offsetY;
				polygon.vertices[2].x = x - offsetX + canvas.width;
				polygon.vertices[2].y = y - offsetY + canvas.height;
			}
		}
	};

	const handleMouseUp = () => {
		mouseEventState.set('isHovering');
		polygon.isSelected = false; // set isSelected to false on mouse up
	};

	const calculateVertices = (width: number, height: number, shrink: number = 5): LookupTable => {
		// Define the corners
		let vertices: LookupTable = {
			tl: { x: shrink, y: shrink }, // top-left
			tr: { x: width - shrink, y: shrink }, // top-right
			br: { x: width - shrink, y: height - shrink }, // bottom-right
			bl: { x: shrink, y: height - shrink }, // bottom-left
			mt: { x: width / 2, y: shrink }, // middle-top
			mr: { x: width - shrink, y: height / 2 }, // middle-right
			mb: { x: width / 2, y: height - shrink }, // middle-bottom
			ml: { x: shrink, y: height / 2 } // middle-left
		};

		return vertices;
	};

	const isNearPoint = (
		mouseX: number,
		mouseY: number,
		pointX: number,
		pointY: number,
		tolerance: number = 5
	) => {
		// Calculate the absolute differences
		const diffX = Math.abs(mouseX - pointX);
		const diffY = Math.abs(mouseY - pointY);
		return diffX <= tolerance && diffY <= tolerance;
	};

	const drawRectangleCanvas = (points: LookupTable, context: CanvasRenderingContext2D) => {
		let rectangleVertices: string[] = ['tl', 'tr', 'br', 'bl'];
		let vertices: Point[] = [];
		for (let i = 0; i < rectangleVertices.length; i++) {
			vertices.push(points[rectangleVertices[i]]);
		}
		drawRectangle(vertices, context, 'red');
	};

	const getAllHandlePositions = (points: LookupTable): Point[] => {
		let handlePositions = ['tl', 'tr', 'br', 'bl', 'mt', 'mr', 'mb', 'ml'];
		let vertices: Point[] = [];
		for (let i = 0; i < handlePositions.length; i++) {
			vertices.push(points[handlePositions[i]]);
		}
		return vertices;
	};

	const drawRectangleHandles = (points: LookupTable, context: CanvasRenderingContext2D) => {
		let vertices = getAllHandlePositions(points);
		drawHandles(vertices, context, 'red', 5);
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
			//drawRectangle(polygon, context, 'red');
			rectWidth = Math.abs(endX - startX);
			rectHeight = Math.abs(endY - startY);
			// changed the condition here
			context.strokeStyle =
				($mouseEventState === 'isTouching' && $navBarState === 'drawRectangle') ||
				$mouseEventState === 'isHovering'
					? defaultcolor
					: highlightcolor;
			context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before redraw

			let points = calculateVertices(rectWidth, rectHeight, 5);
			handlePositions = getAllHandlePositions(points); // update handlePositions

			drawRectangleHandles(points, context);
			drawRectangleCanvas(points, context);
		}
	});

	const handleDrag = (dx: number, dy: number, corner: string) => {
		// Further logic for other corners...
	};
</script>

<div
	id={polygon.id}
	style="position: absolute; left: {polygon.vertices[0].x}px; top: {polygon.vertices[0]
		.y}px; cursor: move"
>
	<canvas
		bind:this={canvas}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
	/>

	<div>
		{#each handlePositions as point (point)}
			<Handle x={point.x} y={point.y} onDrag={(dx, dy) => handleDrag(dx, dy, 'tl')} />
		{/each}
	</div>
</div>
