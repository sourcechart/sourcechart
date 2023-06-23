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

	import { redraw, drawRectangle, drawHandles, getRectangleHandles } from './canvas-utils/Draw';
	import {
		getContainingPolygon,
		isPointInPolygon,
		calculateRectangleHandles
	} from './canvas-utils/PolygonOperations';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let id: string;
	let highlightColor: string;

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

	let cursorClass: string = 'grabbable';

	const tolerance: number = 1;
	const handleRadius: number = 1;

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
			if (polygon && isPointInPolygon({ x, y }, polygon)) {
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
		let handlePositions;
		const polygon = polygons.find((polygon) => {
			let insidePolygon =
				isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			cursorClass = 'move';
			let checkHandles = getRectangleHandles(polygon);
			if (checkHandles) {
				cursorClass = hoverIntersection ? checkHandles : '';
				return true; // This will break the .find() loop
			}

			return false; // This will continue to the next item in the .find() loop
		});

		if (!polygon) {
			cursorClass = ''; // Reset the cursorClass if not found any polygon
		}

		if (polygon) handlePositions = calculateRectangleHandles(polygon);
		let overHandle = false;
		if (handlePositions)
			handlePositions.forEach((handle) => {
				const dx = x - handle.x;
				const dy = y - handle.y;
				const distanceSquared = dx * dx + dy * dy;
				if (distanceSquared < handleRadius * handleRadius) {
					overHandle = true;
				}
			});

		if (overHandle) {
			cursorClass = 'pointer'; // Change cursor to pointer when over handle
		} else {
			cursorClass = 'default'; // Change cursor back to default when not over handle
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
		const polygon = getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height, selectedPolygonIndex);
	};

	const getHandlesHovered = (polygon: Polygon, edges: Point[]) => {
		const { x, y } = currentMousePosition;

		if (Math.abs(y - polygon.vertices[0].y) < tolerance) {
			return 'top';
		} else if (Math.abs(x - polygon.vertices[1].x) < tolerance) {
			return 'right';
		} else if (Math.abs(y - polygon.vertices[2].y) < tolerance) {
			return 'bottom';
		} else if (Math.abs(x - polygon.vertices[3].x) < tolerance) {
			return 'left';
		}
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

	const scaleCorners = (polygon: Polygon, scaleCorner: string, x: number, y: number) => {};

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
		const polygon = getContainingPolygon(point, polygons);
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
