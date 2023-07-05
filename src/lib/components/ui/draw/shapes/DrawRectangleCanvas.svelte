<script lang="ts">
	import { mouseEventState, navBarState, polygons, mouseType } from '$lib/io/Stores';
	import { isPointInPolygon } from './draw-utils/PolygonOperations';

	import { drawHandles, drawRectangle } from './draw-utils/Draw';
	import { afterUpdate } from 'svelte';
	import { Chart } from '$lib/components/ui/echarts';

	export let polygon: Polygon;
	export let highlightcolor: string;
	export let defaultcolor: string;

	let offsetX = 0;
	let offsetY = 0;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let dragging = false;

	let rectWidth: number = 0;
	let rectHeight: number = 0;
	let points: LookupTable = {};
	let plotHeight: number = 0;
	let plotWidth: number = 0;

	export let options: any = {
		xAxis: {
			data: [],
			type: 'category'
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [],
				type: 'bar'
			}
		]
	};

	$: console.log(options);
	const calculateVertices = (width: number, height: number, shrink: number = 5): LookupTable => {
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

	const handleMouseDown = (e: MouseEvent) => {
		let x = e.clientX;
		let y = e.clientY;
		let inPolygon = isPointInPolygon({ x, y }, polygon);
		if (inPolygon) {
			offsetX = x - polygon.vertices[0].x;
			offsetY = y - polygon.vertices[0].y;
			dragging = true;
		}
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

	const handleMouseMove = (e: MouseEvent) => {
		if (!dragging) return;
		let x = e.clientX;
		let y = e.clientY;
		if ($navBarState === 'select' && $mouseEventState === 'isTouching' && $mouseType === 'move') {
			let newPolygon = JSON.parse(JSON.stringify(polygon)); // create a deep copy of the polygon
			newPolygon.vertices[0].x = x - offsetX;
			newPolygon.vertices[0].y = y - offsetY;
			newPolygon.vertices[2].x = x - offsetX + canvas.width;
			newPolygon.vertices[2].y = y - offsetY + canvas.height;
			polygons.update((p) => p.map((poly) => (poly.id === newPolygon.id ? newPolygon : poly)));
			polygon = newPolygon;
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		if (!dragging) return;
		let x = e.clientX;
		let y = e.clientY;
		if ($navBarState === 'select' && $mouseEventState === 'isTouching' && $mouseType === 'move') {
			let newPolygon = JSON.parse(JSON.stringify(polygon)); // create a deep copy of the polygon
			newPolygon.vertices[0].x = x - offsetX;
			newPolygon.vertices[0].y = y - offsetY;
			newPolygon.vertices[2].x = x - offsetX + canvas.width;
			newPolygon.vertices[2].y = y - offsetY + canvas.height;
			polygons.update((p) => p.map((poly) => (poly.id === newPolygon.id ? newPolygon : poly)));
			dragging = false;
		}
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
			rectWidth = Math.abs(endX - startX);
			rectHeight = Math.abs(endY - startY);

			context.strokeStyle =
				($mouseEventState === 'isTouching' && $navBarState === 'drawRectangle') ||
				$mouseEventState === 'isHovering'
					? defaultcolor
					: highlightcolor;
			context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before redraw
			points = calculateVertices(rectWidth, rectHeight, 5);

			plotWidth = getPlotWidth();
			plotHeight = getPlotHeight();

			drawRectangleHandles(points, context);
			drawRectangleCanvas(points, context);
		}
	});

	const getPlotWidth = () => {
		return Math.abs(polygon.vertices[0].x - polygon.vertices[2].x);
	};

	const getPlotHeight = () => {
		return Math.abs(polygon.vertices[0].y - polygon.vertices[2].y);
	};

	$: plotWidth = getPlotWidth();
	$: plotHeight = getPlotHeight();
</script>

<div
	id={polygon.id}
	style="position: absolute; left: {Math.min(
		polygon.vertices[0].x,
		polygon.vertices[2].x
	)}px; top: {Math.min(polygon.vertices[0].y, polygon.vertices[2].y)}px;"
>
	<div
		style="position: relative; width: {plotWidth}px; height: {plotHeight}px;"
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
	>
		<canvas style="position: absolute;  z-index: 2;" bind:this={canvas} />
		<div style="position: absolute; width:  {plotWidth}px; height: {plotHeight}px; z-index:1">
			<Chart {options} renderer={'svg'} />
		</div>
	</div>
</div>
