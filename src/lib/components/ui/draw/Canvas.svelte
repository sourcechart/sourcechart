<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import {
		mouseMove,
		touchStart,
		touchMove,
		trackMouseState,
		onMouseLeave,
		touchEnd
	} from '$lib/actions/mouseActions';

	import {
		activeSidebar,
		allCharts,
		clearChartOptions,
		mostRecentChartID,
		navBarState,
		mouseEventState,
		isMouseDown
	} from '$lib/io/stores';
	import { generateID } from '$lib/io/generateID';
	import { addChartMetaData } from '$lib/io/chartMetaDataManagement';

	import { redraw, drawRectangle, drawHandles } from './canvas-utils/draw';
	import { getContainingPolygon, isPointInPolygon } from './canvas-utils/polygonOperations';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let id: string;
	let width: number;
	let height: number;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let selectedPolygonIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point;
	let cursorStyle: string;

	let dragOffset: Point = { x: 0, y: 0 };

	$: cursorClass = $isMouseDown ? cursorStyle : '';
	const handleMouseMove = (x: number, y: number): void => {
		console.log('foo');
		let currentMousePosition = { x, y };
		for (let i = 0; i < polygons.length; i++) {
			const polygon = polygons[i];
			//		const edgeHovered = getEdgeHovered(polygon);
			//isPointInPolygon(currentMousePosition );
			if (isPointInPolygon(currentMousePosition, polygon)) {
				cursorStyle = 'grabbable';
				break;
			}
		}
	};

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
		});
	}

	function removeChart() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (
			(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
			selectedPolygonIndex !== null
		) {
			removeChart();
			$activeSidebar = false;
			polygons.splice(selectedPolygonIndex, 1);
			selectedPolygonIndex = null;
		}
	}

	const handleTouchStart = (x: number, y: number): void => {
		//check if the user is not currently drawing.
		id = generateID();
		if ($mouseEventState !== 'isTouching') {
			addChartMetaData(id, $navBarState);
			mouseEventState.set('isTouching');
			start = { x, y };
		}
	};

	const handleTouchMove = (x: number, y: number): void => {
		if (context && $mouseEventState === 'isTouching') {
			if ($navBarState === 'drawRectangle') {
				handleTouchCreateShapes(x, y, context);
			} else if ($navBarState === 'eraser') {
				handleTouchErase(x, y, context);
			} else if ($navBarState === 'select') {
				console.log('foo');
			}
		}
	};

	const handleTouchCreateShapes = (
		x: number,
		y: number,
		context: CanvasRenderingContext2D
	): void => {
		if ($navBarState === 'drawRectangle') {
			redraw(polygons, context, width, height, selectedPolygonIndex);
			const polygon = {
				id: id,
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			};
			drawRectangle(polygon, context, 'red');
		}
	};

	const handleTouchErase = (x: number, y: number, context: CanvasRenderingContext2D): void => {
		const currentTouchPoint: Point = { x, y };
		const polygon = getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height, selectedPolygonIndex);
	};

	const handleTouchEnd = (x: number, y: number) => {
		if (
			$mouseEventState === 'isTouching' &&
			$navBarState !== 'eraser' &&
			$navBarState !== 'select'
		) {
			const polygon = {
				id: id,
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			};
			polygons.push(polygon);
			if (context) addHandleToShape(polygon, 'red', context);
		}
		mouseEventState.set('isHovering');
	};

	const handleClick = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		const point: Point = { x, y };
		const polygon = getContainingPolygon(point, polygons);
		if (polygon) {
			selectedPolygonIndex = polygons.indexOf(polygon);
		}
		if (context && polygon) {
			redraw(polygons, context, width, height, selectedPolygonIndex);
			addHandleToShape(polygon, 'red', context);
		}
	};
	function addHandleToShape(
		polygon: Polygon,
		lineColor: string,
		context: CanvasRenderingContext2D
	) {
		context.strokeStyle = lineColor;
		drawHandles(polygon, context);
	}
</script>

<div {id}>
	<canvas
		{width}
		{height}
		class={cursorClass}
		bind:this={canvas}
		on:click={handleClick}
		use:trackMouseState
		use:touchStart={{
			onStart: handleTouchStart
		}}
		use:mouseMove={{
			onMove: handleMouseMove
		}}
		use:touchMove={{
			onMove: handleTouchMove
		}}
		use:touchEnd={{
			onEnd: handleTouchEnd
		}}
		use:onMouseLeave={{
			onLeave: () => {
				console.log('leave');
			}
		}}
	/>
</div>

<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>

<style>
	.grabbable {
		cursor: grab;
	}
	.ns-resize,
	.ew-resize {
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: -moz-grab;
		cursor: -webkit-grab;
	}

	.grabbable:active,
	.ns-resize:active,
	.ew-resize:active {
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

	.ns-resize {
		cursor: ns-resize;
	}

	.ew-resize {
		cursor: ew-resize;
	}
</style>
