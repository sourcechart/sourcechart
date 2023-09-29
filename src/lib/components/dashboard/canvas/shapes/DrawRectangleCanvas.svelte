<script lang="ts">
	import {
		allCharts,
		mostRecentChartID,
		canvasBehavior,
		getChartOptions,
		activeSidebar,
		touchType
	} from '$lib/io/Stores';
	import {
		isPointInPolygon,
		calculateVertices,
		generateHandleRectangles
	} from '../draw-utils/PolygonOperations';
	import { drawRectangle } from '../draw-utils/Draw';
	import { afterUpdate } from 'svelte';
	import { Chart } from '$lib/components/dashboard/echarts';
	import { onMount } from 'svelte';

	export let polygon: Polygon;

	let offsetX = 0;
	let offsetY = 0;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let dragging = false;
	let dataAvailable = false; // Track whether data is available in the options.axis.data
	let backupColor: string = '#9d99dc';

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
			type: 'value',
			axisLabel: {
				padding: [0, 20, 10, 20] // Increased padding
			}
		},
		series: [
			{
				data: [],
				type: 'bar'
			}
		],
		title: {
			left: 'left'
		},
		grid: {
			left: '15%' // Adjust the percentage as needed
		}
	};

	$: CANVASBEHAVIOR = canvasBehavior();
	$: chartOptions = getChartOptions(polygon.id); //@ts-ignore
	$: if ($chartOptions?.chartOptions) options = $chartOptions?.chartOptions;
	$: dataAvailable = options?.xAxis?.data?.length > 0;
	$: isRectangleVisible = !dataAvailable || (dataAvailable && $mostRecentChartID === polygon.id);

	$: if (dataAvailable) {
		backupColor = 'transparent';
	} else {
		backupColor = '#9d99dc';
	}

	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('touchmove', handleMouseMove);
		window.addEventListener('touchend', handleMouseUp);
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('touchmove', handleMouseMove);
			window.removeEventListener('touchend', handleMouseUp);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	const drawRectangleCanvas = (
		points: LookupTable,
		context: CanvasRenderingContext2D,
		color: string
	) => {
		var rectangleVertices: string[] = ['mt', 'mr', 'mb', 'ml'];
		var vertices: Point[] = [];
		for (var i = 0; i < rectangleVertices.length; i++) {
			vertices.push(points[rectangleVertices[i]]);
		}
		drawRectangle(vertices, context, color);
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		var x, y;
		if (e instanceof TouchEvent) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = (e as MouseEvent).clientX;
			y = (e as MouseEvent).clientY;
		}

		let inPolygon = isPointInPolygon({ x, y }, polygon);
		if (inPolygon) {
			offsetX = x - polygon.vertices[0].x;
			offsetY = y - polygon.vertices[0].y;
			dragging = true;
		}

		if (e instanceof TouchEvent) {
			e.preventDefault();
		}
		isRectangleVisible = true;
	};

	const handleClickOutside = (e: MouseEvent | TouchEvent) => {
		const target = e.target as Node;
		if (dataAvailable && container && !container.contains(target)) {
			isRectangleVisible = false;
		}
	};

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		if (!dragging) return;

		var x, y;
		if (e instanceof TouchEvent) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = (e as MouseEvent).clientX;
			y = (e as MouseEvent).clientY;
		}

		if ($CANVASBEHAVIOR === 'isTranslating' && polygon.id) {
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

		if (e instanceof TouchEvent) {
			e.preventDefault();
		}
	};

	const updateAllCharts = (updatedPolygon: Polygon) => {
		let i = $allCharts.findIndex((chart) => chart.chartID === polygon.id);
		let chart = $allCharts[i];
		chart.polygon.vertices = updatedPolygon.vertices;
		$allCharts[i] = chart;
	};

	const handleMouseUp = (e: MouseEvent | TouchEvent) => {
		if (!dragging) return;

		var x, y;
		if (e instanceof TouchEvent) {
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
		} else {
			x = (e as MouseEvent).clientX;
			y = (e as MouseEvent).clientY;
		}

		if ($CANVASBEHAVIOR === 'isTranslating') {
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

		if (context) {
			rectWidth = Math.abs(endX - startX);
			rectHeight = Math.abs(endY - startY);

			context.strokeStyle = 'transparent';
			points = calculateVertices(rectWidth, rectHeight, 5);

			plotWidth = getPlotWidth();
			plotHeight = getPlotHeight();

			drawRectangleCanvas(points, context, 'transparent');
		}
	});

	$: plotWidth = getPlotWidth();
	$: points = calculateVertices(rectWidth, rectHeight, 5);
	$: handles = generateHandleRectangles(points, 9);
	$: plotHeight = getPlotHeight();
	let container;
</script>

<div
	bind:this={container}
	id={polygon.id}
	style="position: absolute; left: {Math.min(
		polygon.vertices[0].x,
		polygon.vertices[2].x
	)}px; top: {Math.min(polygon.vertices[0].y, polygon.vertices[2].y)}px; "
	on:click={() => {
		isRectangleVisible = true;
	}}
	on:keypress={() => {
		null;
	}}
>
	<div
		style="position: relative; width: {plotWidth}px; height: {plotHeight}px;  cursor: {$touchType} "
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:touchstart={handleMouseDown}
		on:touchmove={handleMouseMove}
		on:touchend={handleMouseUp}
		class="rounded-sm"
	>
		<canvas style="position: absolute;  z-index: {dragging ? 4 : 2};" bind:this={canvas} />
		<div
			style="position: absolute; width:  {plotWidth}px; height: {plotHeight}px; z-index:1;"
			class="overflow-vis"
		>
			<Chart {options} renderer={'svg'} />
		</div>
		<svg
			style="position: absolute; width: {plotWidth}px; height: {plotHeight}px;"
			viewBox={`0 0 ${plotWidth} ${plotHeight}`}
		>
			{#if isRectangleVisible}
				<rect
					x={points.tl.x}
					y={points.tl.y}
					width={points.br.x - points.tl.x}
					height={points.br.y - points.tl.y}
					fill="transparent"
<<<<<<< HEAD
					stroke="#9d99dc"
=======
					stroke={$activeSidebar && ($mostRecentChartID === polygon.id || polygon.id === undefined)
						? '#9d99dc'
						: backupColor}
>>>>>>> master
				/>

				{#each handles as handle}
					<rect
						x={handle.x}
						y={handle.y}
						width={handle.width}
						height={handle.height}
						fill="#121212"
						stroke="#9d99dc"
						stroke-width="0.8"
						rx="2"
						ry="2"
					/>
				{/each}
			{/if}
		</svg>
	</div>
</div>
