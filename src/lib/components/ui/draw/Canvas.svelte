<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import * as MouseActions from '$lib/actions/MouseActions';

	import {
		activeSidebar,
		allCharts,
		clearChartOptions,
		mostRecentChartID,
		navBarState,
		mouseEventState
	} from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';

	import { redraw, drawRectangle, drawHandles } from './canvas-utils/Draw';
	import * as PolyOps from './canvas-utils/PolygonOperations';

	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	let id: string;
	let highlightColor: string;
	let cursorClass: string | null;

	const tolerance: number = 5;
	const handleRadius: number = 1;

	let width: number = 0;
	let height: number = 0;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	let selectedPolygonIndex: number | null = null;
	let scalingHandleIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };
	let hoverIntersection: boolean = false;

	$: if (context) highlightColor = 'red';

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
		});
	}

	/**
	 * ### Remove Chart from the $allCharts stores
	 */
	const removeChart = () => {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	};

	/**
	 * ### Remove chart from dashboard on BackSpace/Delete/Escape.
	 * @param e Keyboard event to delete items.
	 *
	 */
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
	 * ### Handle the touch start event.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchStart = (x: number, y: number): void => {
		//check if the user is not currently drawing.

		id = generateID();
		if ($navBarState === 'select' && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (polygon && PolyOps.isPointInPolygon({ x, y }, polygon)) {
				dragOffset = { x, y };
				mouseEventState.set('isTranslating');
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
			mouseEventState.set('isTranslating');
			dragOffset = { x, y };
			return;
		}
	};

	/**
	 * ### Handle the movement of the mouse when it is not clicked.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleMouseMove = (x: number, y: number): void => {
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygon = polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				cursorClass = PolyOps.getHandlesHovered(currentMousePosition, polygon, tolerance);
				console.log(cursorClass);
				if (cursorClass) return true; // This will break the .find() loop
			}
			return false; // This will continue to the next item in the .find() loop
		});

		if (!polygon) {
			cursorClass = ''; // Reset the cursorClass if not found any polygon
		} else if (hoverPolygon && !cursorClass) {
			cursorClass = 'move'; // If we found a polygon but not hovering over any handles, set to 'move'
		} else {
			cursorClass = cursorClass || 'default'; // Change cursor back to default when not over handle
		}
	};

	/**
	 * ### Handle all touch movements
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchMove = (x: number, y: number): void => {
		if (context) {
			if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
				handleTouchCreateShapes(x, y, context);
			} else if ($navBarState === 'eraser' && $mouseEventState === 'isTouching') {
				handleTouchErase(x, y, context);
			} else if (
				$navBarState === 'select' &&
				$mouseEventState === 'isTranslating' &&
				selectedPolygonIndex !== null
			) {
				handleTouchTranslate(x, y, context, selectedPolygonIndex, highlightColor);
				console.log(x, y);
			} else if ($mouseEventState === 'isScaling' && scalingHandleIndex !== null) {
				handleTouchScale(x, y);
			}
		}
	};

	/**
	 * ### Translate (Drag) the polygon element to a different position on the screen.
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

		drawHandles(polygon, context, highlightColor, handleRadius);
	};

	/**
	 * ### Handle the scaling of a rectangle to different heights and widths
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchScale = (x: number, y: number) => {
		if (selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			//let handlePositions: Point[] = [...polygon.vertices];
			if (scalingHandleIndex) {
				if (scalingHandleIndex < polygon.vertices.length) {
					polygon.vertices[scalingHandleIndex] = { x, y };
				} else {
					let vertexIndex = scalingHandleIndex - polygon.vertices.length;
					let nextVertexIndex = (scalingHandleIndex + 1) % polygon.vertices.length;
					polygon.vertices[vertexIndex].x = x;
					polygon.vertices[nextVertexIndex].x = x;
				}
			}
			if (context) {
				redraw(polygons, context, width, height, selectedPolygonIndex);
				drawHandles(polygon, context, highlightColor, handleRadius);
			}
		}
	};

	/**
	 * ### Create the shapes where charts will be put.
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
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 * @param context Canvas Rendering context
	 */
	const handleTouchErase = (x: number, y: number, context: CanvasRenderingContext2D): void => {
		const currentTouchPoint: Point = { x, y };
		const polygon = PolyOps.getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height, selectedPolygonIndex);
	};

	const scaleEdges = (polygon: Polygon, scaleEdge: string, x: number, y: number) => {
		if (scaleEdge === 'top') {
			polygon.vertices[0].y = y;
			polygon.vertices[1].y = y;
		} else if (scaleEdge === 'right') {
			polygon.vertices[1].x = x;
			polygon.vertices[2].x = x;
		} else if (scaleEdge === 'bottom') {
			polygon.vertices[2].y = y;
			polygon.vertices[3].y = y;
		} else if (scaleEdge === 'left') {
			polygon.vertices[3].x = x;
			polygon.vertices[0].x = x;
		}
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
			if (context) {
				context.strokeStyle = highlightColor;
				drawHandles(polygon, context, highlightColor, handleRadius);
			}
		}
		if ($mouseEventState === 'isScaling' && scalingHandleIndex !== null) {
			handleTouchScale(x, y);
			scalingHandleIndex = null;
		}

		mouseEventState.set('isHovering');
	};

	/**
	 * Handles the click functionality of the dashboard
	 *
	 * @param Mouse Event
	 */
	const handleClick = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		const point: Point = { x, y };
		const polygon = PolyOps.getContainingPolygon(point, polygons);
		if (polygon) {
			selectedPolygonIndex = polygons.indexOf(polygon);
		}
		if (context && polygon) {
			redraw(polygons, context, width, height, selectedPolygonIndex);
			context.strokeStyle = highlightColor;
			drawHandles(polygon, context, highlightColor, handleRadius);
		}
	};
</script>

<div {id}>
	<canvas
		{width}
		{height}
		style="cursor: {cursorClass};"
		bind:this={canvas}
		on:click={handleClick}
		use:MouseActions.trackMouseState
		use:MouseActions.touchStart={{
			onStart: handleTouchStart
		}}
		use:MouseActions.mouseMove={{
			onMove: handleMouseMove
		}}
		use:MouseActions.touchMove={{
			onMove: handleTouchMove
		}}
		use:MouseActions.touchEnd={{
			onEnd: handleTouchEnd
		}}
		use:MouseActions.onMouseLeave={{
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
