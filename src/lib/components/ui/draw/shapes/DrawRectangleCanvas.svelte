<script lang="ts">
	import { drawHandles, drawRectangle } from './draw-utils/Draw';
	import { mouseEventState, navBarState } from '$lib/io/Stores';
	import * as MouseActions from '$lib/actions/MouseActions';
	import { afterUpdate } from 'svelte';

	export let polygon: Polygon;

	export let highlightcolor: string;
	export let defaultcolor: string;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX = 0;
	let offsetY = 0;
	let rectWidth: number;
	let rectHeight: number;

	// DrawRectangle.svelte
	const handleMouseDown = (e: MouseEvent) => {
		polygon.isSelected = true; // set isSelected to true on mouse down
		if (polygon.isSelected) {
			offsetX = e.clientX - polygon.vertices[0].x;
			offsetY = e.clientY - polygon.vertices[0].y;
		}
	};
	const handleMouseMove = (e: MouseEvent) => {
		if ($mouseEventState === 'isTouching' && polygon.isSelected) {
			polygon.vertices[0].x = e.clientX - offsetX;
			polygon.vertices[0].y = e.clientY - offsetY;
			polygon.vertices[2].x = e.clientX - offsetX + canvas.width;
			polygon.vertices[2].y = e.clientY - offsetY + canvas.height;
		}
	};

	const handleMouseUp = () => {
		mouseEventState.set('isHovering');
		polygon.isSelected = false; // set isSelected to false on mouse up
	};

	const updateCanvasDimensions = () => {
		let startX = Math.min(polygon.vertices[0].x, polygon.vertices[2].x);
		let startY = Math.min(polygon.vertices[0].y, polygon.vertices[2].y);
		let endX = Math.max(polygon.vertices[0].x, polygon.vertices[2].x);
		let endY = Math.max(polygon.vertices[0].y, polygon.vertices[2].y);

		canvas.style.left = `${startX}px`;
		canvas.style.top = `${startY}px`;
		canvas.width = Math.abs(endX - startX);
		canvas.height = Math.abs(endY - startY);
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

	const drawRectangleCanvas = (points: LookupTable, context: CanvasRenderingContext2D) => {
		let rectangleVertices: string[] = ['tl', 'tr', 'br', 'bl'];
		let vertices: Point[] = [];
		for (let i = 0; i < rectangleVertices.length; i++) {
			vertices.push(points[rectangleVertices[i]]);
		}
		drawRectangle(vertices, context, 'red');
	};

	const drawRectangleHandles = (points: LookupTable, context: CanvasRenderingContext2D) => {
		let handlePositions = ['tl', 'tr', 'br', 'bl', 'mt', 'mr', 'mb', 'ml'];
		let vertices: Point[] = [];
		for (let i = 0; i < handlePositions.length; i++) {
			vertices.push(points[handlePositions[i]]);
		}
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

			drawRectangleHandles(points, context);
			drawRectangleCanvas(points, context);
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
