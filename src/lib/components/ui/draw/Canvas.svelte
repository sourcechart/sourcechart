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
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let id: string;

	let width: number = 0;
	let height: number = 0;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	let selectedPolygonIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };
	let hoverIntersection: boolean = false;

	let HIGHLIGHTCOLOR: string;
	let cursorClass: string | null;
	let offsetX: number = 0;
	let offsetY: number = 0;
	let handlePosition: HandlePosition;

	const tolerance: number = 5;
	const handleRadius: number = 5;

	$: console.log($mouseEventState, handlePosition, $navBarState);

	$: if (context) HIGHLIGHTCOLOR = 'red';

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			const rect = canvas.getBoundingClientRect();
			offsetX = rect.left - handleRadius;
			offsetY = rect.top - handleRadius;
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
		x = x - offsetX;
		y = y - offsetY;
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
		x = x - offsetX;
		y = y - offsetY;
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygon = polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, tolerance);
				cursorClass = getCursorStyleFromDirection(handlePosition);
				if (handlePosition) return true; // This will break the .find() loop
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
		x = x - offsetX;
		y = y - offsetY;
		console.log(cursorClass, $mouseEventState, $navBarState);
		if (context) {
			if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
				handleTouchCreateShapes(x, y, context);
			}
			if ($navBarState === 'eraser' && $mouseEventState === 'isTouching') {
				handleTouchErase(x, y, context);
			}
			if (
				$navBarState === 'select' &&
				$mouseEventState === 'isTranslating' &&
				cursorClass === 'move' &&
				selectedPolygonIndex !== null
			) {
				console.log('translating');
				handleTouchTranslate(x, y, context, selectedPolygonIndex, HIGHLIGHTCOLOR);
			}
			if (
				$navBarState === 'select' &&
				$mouseEventState === 'isTranslating' &&
				cursorClass !== 'move' &&
				selectedPolygonIndex !== null
			) {
				handleTouchResize(x, y);
			}
		}
	};

	/**
	 * ### Translate (Drag) the polygon element to a different position on the screen.
	 *
	 * @param xWithOffset
	 * @param yWithOffset
	 * @param context Canvas Rendering context
	 * @param selectedPolygonIndex the polygon we clicked on
	 */
	const handleTouchTranslate = (
		xWithOffset: number,
		yWithOffset: number,
		context: CanvasRenderingContext2D,
		selectedPolygonIndex: number,
		HIGHLIGHTCOLOR: string
	) => {
		const dx = xWithOffset - dragOffset.x;
		const dy = yWithOffset - dragOffset.y;
		const polygon = polygons[selectedPolygonIndex];
		polygon.vertices = polygon.vertices.map((vertex) => ({
			x: vertex.x + dx,
			y: vertex.y + dy
		}));
		dragOffset = { x: xWithOffset, y: yWithOffset };
		redraw(polygons, context, width, height, selectedPolygonIndex);
		context.strokeStyle = HIGHLIGHTCOLOR;
		drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
	};

	/**
	 *Get Cursor from Direction
	 *
	 * @param direction
	 */
	const getCursorStyleFromDirection = (direction: string): string | null => {
		const cursorMap: { [key: string]: string } = {
			n: 'ns-resize',
			ne: 'nesw-resize',
			e: 'ew-resize',
			se: 'nwse-resize',
			s: 'ns-resize',
			sw: 'nesw-resize',
			w: 'ew-resize',
			nw: 'nwse-resize'
			//center: 'move'
		};
		return cursorMap[direction] || null;
	};

	/**
	 * ### Handle the scaling of a rectangle to different heights and widths
	 *
	 * @param xWithOffset
	 * @param yWithOffset
	 */
	const handleTouchResize = (xWithOffset: number, yWithOffset: number) => {
		if (selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (handlePosition) resizeRectangle(xWithOffset, yWithOffset, polygon, handlePosition);
			if (context) {
				redraw(polygons, context, width, height, selectedPolygonIndex);
				drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
			}
		}
	};

	/**
	 * ### Create the shapes where charts will be put.
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
	 * @param context Canvas Rendering context
	 */
	const handleTouchCreateShapes = (
		xWithOffset: number,
		yWithOffset: number,
		context: CanvasRenderingContext2D
	): void => {
		if ($navBarState === 'drawRectangle') {
			redraw(polygons, context, width, height, selectedPolygonIndex);
			const polygon = {
				id: id,
				vertices: [
					{ x: start.x, y: start.y },
					{ x: xWithOffset, y: start.y },
					{ x: xWithOffset, y: yWithOffset },
					{ x: start.x, y: yWithOffset }
				]
			};
			drawRectangle(polygon, context, HIGHLIGHTCOLOR);
		}
	};

	/**
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param xWithOffset
	 * @param yWithOffset
	 * @param context
	 */
	const handleTouchErase = (
		xWithOffset: number,
		yWithOffset: number,
		context: CanvasRenderingContext2D
	): void => {
		const currentTouchPoint: Point = { x: xWithOffset, y: yWithOffset };
		const polygon = PolyOps.getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height, selectedPolygonIndex);
	};

	const resizeRectangle = (x: number, y: number, polygon: Polygon, resizeEdge: string) => {
		if (resizeEdge === 'n') {
			polygon.vertices[0].y = y;
			polygon.vertices[1].y = y;
		} else if (resizeEdge === 'e') {
			polygon.vertices[1].x = x;
			polygon.vertices[2].x = x;
		} else if (resizeEdge === 's') {
			polygon.vertices[2].y = y;
			polygon.vertices[3].y = y;
		} else if (resizeEdge === 'w') {
			polygon.vertices[3].x = x;
			polygon.vertices[0].x = x;
		} else if (resizeEdge === 'ne') {
			polygon.vertices[0].y = y;
			polygon.vertices[1].x = x;
			polygon.vertices[1].y = y;
		} else if (resizeEdge === 'se') {
			polygon.vertices[2].x = x;
			polygon.vertices[1].x = x;
			polygon.vertices[2].y = y;
		} else if (resizeEdge === 'sw') {
			polygon.vertices[3].x = x;
			polygon.vertices[2].x = x;
			polygon.vertices[2].y = y;
			polygon.vertices[3].y = y;
		} else if (resizeEdge === 'nw') {
			polygon.vertices[0].x = x;
			polygon.vertices[0].y = y;
			polygon.vertices[3].x = x;
		}
	};

	const handleTouchEnd = (x: number, y: number) => {
		x = x - offsetX;
		y = y - offsetY;
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
				context.strokeStyle = HIGHLIGHTCOLOR;
				drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
			}
		}
		if ($mouseEventState === 'isResizing') {
			handleTouchResize(x, y);
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
			context.strokeStyle = HIGHLIGHTCOLOR;
			drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
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
