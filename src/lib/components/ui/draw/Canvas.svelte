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

	let cursorStyle: string;
	let highlightColor: string;

	let polygons: Polygon[] = [];

	let start: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };

	$: if (context) highlightColor = 'red';
	$: cursorClass = $isMouseDown ? cursorStyle : '';

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
		});
	}

	const removeChart = () => {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (
			(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
			selectedPolygonIndex !== null
		) {
			removeChart();
			$activeSidebar = false;
			polygons.splice(selectedPolygonIndex, 1);
			selectedPolygonIndex = null;
		}
	};

	/**
	 * Handle the touch start event.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchStart = (x: number, y: number): void => {
		//check if the user is not currently drawing.
		id = generateID();

		if ($navBarState === 'select' && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (
				//I might need this
				$mouseEventState === 'isTouching' &&
				polygon &&
				isPointInPolygon({ x, y }, polygon)
			) {
				mouseEventState.set('isMoving');
				dragOffset = { x, y };
				return;
			}
		}
		if ($mouseEventState !== 'isTouching') {
			addChartMetaData(id, $navBarState);
			mouseEventState.set('isTouching');
			start = { x, y };
		} else if (
			$mouseEventState === 'isTouching' &&
			$navBarState === 'select' &&
			selectedPolygonIndex !== null
		) {
			mouseEventState.set('isMoving');
			dragOffset = { x, y };
			return;
		}
	};

	/**
	 * Handle the movement of the mouse when it is not clicked.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleMouseMove = (x: number, y: number): void => {
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

	/**
	 * Handle all touch movements
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchMove = (x: number, y: number): void => {
		if (context && $mouseEventState === 'isTouching') {
			if ($navBarState === 'drawRectangle') {
				handleTouchCreateShapes(x, y, context);
			} else if ($navBarState === 'eraser') {
				handleTouchErase(x, y, context);
			} else if ($navBarState === 'select' && selectedPolygonIndex !== null) {
				handleTouchTranslate(x, y, context, selectedPolygonIndex, highlightColor);
			}
		}
	};

	/**
	 * Translate (Drag) the polygon element to a different position on the screen.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 * @param context Canvas Rendering context
	 * @param selectedPolygonIndex the polygon we clicked on
	 */
	const handleTouchTranslate = (
		x: number,
		y: number,
		context: CanvasRenderingContext2D,
		selectedPolygonIndex: number,
		highlightColor: string
	) => {
		const dx = x - dragOffset.x;
		const dy = y - dragOffset.y;
		const polygon = polygons[selectedPolygonIndex];
		polygon.vertices = polygon.vertices.map((vertex) => ({
			x: vertex.x + dx,
			y: vertex.y + dy
		}));
		dragOffset = { x, y };
		redraw(polygons, context, width, height, selectedPolygonIndex);
		context.strokeStyle = highlightColor;

		drawHandles(polygon, context, highlightColor);
	};

	/**
	 * Handle the movement of the mouse when it is not clicked.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchScale = (x: number, y: number) => {};

	/**
	 * Create the shapes where charts will be put.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 * @param context Canvas Rendering context
	 */
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
			drawRectangle(polygon, context, highlightColor);
		}
	};

	/**
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 * @param context Canvas Rendering context
	 */
	const handleTouchErase = (x: number, y: number, context: CanvasRenderingContext2D): void => {
		const currentTouchPoint: Point = { x, y };
		const polygon = getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height, selectedPolygonIndex);
	};

	/**
	 * Handle the end of touching movement
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
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
			if (context) {
				context.strokeStyle = highlightColor;
				drawHandles(polygon, context, highlightColor);
			}
		}
		mouseEventState.set('isHovering');
	};

	const handleClick = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		const point: Point = { x, y };
		const polygon = getContainingPolygon(point, polygons);
		if (polygon) {
			selectedPolygonIndex = polygons.indexOf(polygon);
		}
		if (context && polygon) {
			redraw(polygons, context, width, height, selectedPolygonIndex);
			context.strokeStyle = highlightColor;
			drawHandles(polygon, context, highlightColor);
		}
	};
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
