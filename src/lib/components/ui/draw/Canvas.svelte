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

	import { redraw, drawRectangle, drawHandles, resizeRectangle } from './canvas-utils/Draw';
	import * as PolyOps from './canvas-utils/PolygonOperations';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

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

	let prevPolygonsLength = 0;

	const tolerance: number = 5;
	const handleRadius: number = 5;
	$: if (context) HIGHLIGHTCOLOR = 'red';

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			const rect = canvas.getBoundingClientRect();
			offsetX = rect.left - handleRadius;
			offsetY = rect.top - handleRadius;
			window.addEventListener('keydown', handleKeyDown);
			return {
				destroy() {
					window.removeEventListener('keydown', handleKeyDown);
				}
			};
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
			if (selectedPolygonIndex > -1) {
				polygons.splice(selectedPolygonIndex, 1);
			}
			if (context) redraw(polygons, context, width, height, selectedPolygonIndex);
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
		if ($navBarState === 'select' && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (polygon && PolyOps.isPointInPolygon({ x, y }, polygon)) {
				dragOffset = { x, y };
				mouseEventState.set('isTranslating');
				return;
			}
		}
		if ($mouseEventState !== 'isTouching') {
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

	const checkMetaDataInStore = (id: string): boolean => {
		return $allCharts.some((item) => item.chartID === id);
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
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
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
	 * Check if new Rectangle so I can add an ID to metadata
	 *
	 * @param polygons
	 */
	const checkNewRectangle = (polygons: Polygon[]): boolean => {
		let isNewRectangle = false;
		if (polygons.length > prevPolygonsLength) {
			isNewRectangle = true;
		}
		prevPolygonsLength = polygons.length;
		return isNewRectangle;
	};

	/**
	 * ### Get Cursor from Direction
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
	 * ### Handle the resizing of a rectangle to different heights and widths
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
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
				vertices: getVertices(xWithOffset, yWithOffset)
			};
			drawRectangle(polygon, context, HIGHLIGHTCOLOR);
		}
	};

	/**
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
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

	const getVertices = (x: number, y: number) => {
		let vertices = [
			{ x: start.x, y: start.y },
			{ x: x, y: start.y },
			{ x: x, y: y },
			{ x: start.x, y: y }
		];
		return vertices;
	};

	/**
	 * ### Handle Touch End
	 *
	 * @param x X position on the screen
	 * @param y Y position on the screen
	 */
	const handleTouchEnd = (x: number, y: number) => {
		x = x - offsetX;
		y = y - offsetY;
		if (
			$mouseEventState === 'isTouching' &&
			$navBarState !== 'eraser' &&
			$navBarState !== 'select'
		) {
			let id = generateID();
			const polygon = {
				id: id,
				vertices: getVertices(x, y)
			};
			addChartMetaData(id, $navBarState);
			polygons.push(polygon);
			if (context) {
				context.strokeStyle = HIGHLIGHTCOLOR;
				redraw(polygons, context, width, height, selectedPolygonIndex);
				drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
			}
		}
		if ($mouseEventState === 'isResizing') {
			handleTouchResize(x, y);
		}
		mouseEventState.set('isHovering');
		navBarState.set('select');
	};
	/**
	 * Handles the click functionality of the dashboard
	 *
	 * @param Mouse Event
	 */
	const handleClick = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		//let polygonID: string;

		const point: Point = { x, y };
		const polygon = PolyOps.getContainingPolygon(point, polygons);

		if (context && polygon) {
			if (polygon?.id) {
				mostRecentChartID.set(polygon.id);
			}
			selectedPolygonIndex = polygons.indexOf(polygon);
			redraw(polygons, context, width, height, selectedPolygonIndex);
			context.strokeStyle = HIGHLIGHTCOLOR;
			drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
		}
		if (!polygon && $navBarState === 'select') {
			if (context) redraw(polygons, context, width, height, selectedPolygonIndex);
			activeSidebar.set(false);
		}
	};
</script>

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
/>

<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
