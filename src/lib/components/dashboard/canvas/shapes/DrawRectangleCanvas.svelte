<script lang="ts">
	import {
		allCharts,
		mostRecentChartID,
		touchStates,
		getChartOptions,
		activeSidebar
	} from '$lib/io/Stores';
	import { isPointInPolygon } from './draw-utils/PolygonOperations';
	import { drawHandles, drawRectangle } from './draw-utils/Draw';
	import { afterUpdate } from 'svelte';
	import { Chart } from '$lib/components/dashboard/echarts';

	export let polygon: Polygon;

	const highlightcolor: string = 'red';
	const defaultcolor: string = 'transparent';

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

	let options: any = {
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

	$: TOUCHSTATE = touchStates();
	$: chartOptions = getChartOptions(polygon.id); //@ts-ignore
	$: if ($chartOptions?.chartOptions) options = $chartOptions?.chartOptions;

	const calculateVertices = (width: number, height: number, shrink: number = 5): LookupTable => {
		var vertices: LookupTable = {
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

	const drawRectangleCanvas = (
		points: LookupTable,
		context: CanvasRenderingContext2D,
		color: string
	) => {
		var rectangleVertices: string[] = ['tl', 'tr', 'br', 'bl'];
		var vertices: Point[] = [];
		for (var i = 0; i < rectangleVertices.length; i++) {
			vertices.push(points[rectangleVertices[i]]);
		}
		drawRectangle(vertices, context, color);
	};

	const handleMouseDown = (e: MouseEvent) => {
		var x = e.clientX; // adjust the mouse x-coordinate by the left offset of the canvas
		var y = e.clientY;

		let inPolygon = isPointInPolygon({ x, y }, polygon);
		if (inPolygon) {
			offsetX = x - polygon.vertices[0].x;
			offsetY = y - polygon.vertices[0].y;
			dragging = true;
		}
	};

	const getAllHandlePositions = (points: LookupTable): Point[] => {
		var handlePositions = ['tl', 'tr', 'br', 'bl', 'mt', 'mr', 'mb', 'ml'];
		var vertices: Point[] = [];
		for (var i = 0; i < handlePositions.length; i++) {
			vertices.push(points[handlePositions[i]]);
		}
		return vertices;
	};

	const drawRectangleHandles = (
		points: LookupTable,
		context: CanvasRenderingContext2D,
		color: string
	) => {
		var vertices = getAllHandlePositions(points);
		drawHandles(vertices, context, color, 5);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!dragging) return;
		var x = e.clientX;
		var y = e.clientY;

		if ($TOUCHSTATE === 'isTranslating' && polygon.id) {
			mostRecentChartID.set(polygon.id);

			var newPolygon = JSON.parse(JSON.stringify(polygon)); // create a deep copy of the polygon
			var dx = x - offsetX;
			var dy = y - offsetY;

			newPolygon.vertices[0].x = dx;
			newPolygon.vertices[0].y = dy;
			newPolygon.vertices[1].x = dx + canvas.width;
			newPolygon.vertices[1].y = dy;
			newPolygon.vertices[2].x = dx + canvas.width;
			newPolygon.vertices[2].y = dy + canvas.height;
			newPolygon.vertices[3].x = dx;
			newPolygon.vertices[3].y = dy + canvas.height;

			updateAllCharts(newPolygon);

			polygon = newPolygon;
		}
	};

	const updateAllCharts = (updatedPolygon: Polygon) => {
		let i = $allCharts.findIndex((chart) => chart.chartID === polygon.id);
		let chart = $allCharts[i];
		chart.polygon.vertices = updatedPolygon.vertices;
		$allCharts[i] = chart;
	};

	const handleMouseUp = (e: MouseEvent) => {
		if (!dragging) return;
		var x = e.clientX;
		var y = e.clientY;
		if ($TOUCHSTATE === 'isTranslating') {
			var dx = x - offsetX;
			var dy = y - offsetY;

			polygon.vertices[0].x = dx;
			polygon.vertices[0].y = dy;
			polygon.vertices[1].x = dx + canvas.width;
			polygon.vertices[1].y = dy;
			polygon.vertices[2].x = dx + canvas.width;
			polygon.vertices[2].y = dy + canvas.height;
			polygon.vertices[3].x = dx;
			polygon.vertices[3].y = dy + canvas.height;

			updateAllCharts(polygon);
			dragging = false;
		}
	};

	const getPlotWidth = () => {
		return Math.abs(polygon.vertices[0].x - polygon.vertices[2].x);
	};

	const getPlotHeight = () => {
		return Math.abs(polygon.vertices[0].y - polygon.vertices[2].y);
	};

	afterUpdate(() => {
		// Set canvas width and height based on the polygon dimensions
		var startX = Math.min(polygon.vertices[0].x, polygon.vertices[2].x);
		var startY = Math.min(polygon.vertices[0].y, polygon.vertices[2].y);
		var endX = Math.max(polygon.vertices[0].x, polygon.vertices[2].x);
		var endY = Math.max(polygon.vertices[0].y, polygon.vertices[2].y);

		canvas.width = Math.abs(endX - startX);
		canvas.height = Math.abs(endY - startY);
		context = canvas.getContext('2d');

		var color =
			$activeSidebar && ($mostRecentChartID === polygon.id || polygon.id === undefined)
				? highlightcolor
				: defaultcolor;

		if (context) {
			rectWidth = Math.abs(endX - startX);
			rectHeight = Math.abs(endY - startY);

			context.strokeStyle = color;
			points = calculateVertices(rectWidth, rectHeight, 5);

			plotWidth = getPlotWidth();
			plotHeight = getPlotHeight();

			drawRectangleHandles(points, context, color);
			drawRectangleCanvas(points, context, color);
		}
	});

	$: plotWidth = getPlotWidth();
	$: plotHeight = getPlotHeight();
</script>

<div
	id={polygon.id}
	style="position: absolute; left: {Math.min(
		polygon.vertices[0].x,
		polygon.vertices[2].x
	)}px; top: {Math.min(polygon.vertices[0].y, polygon.vertices[2].y)}px; border:thin"
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
