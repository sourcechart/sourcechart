<script lang="ts">
	import DrawRectangleCanvas from './shapes/DrawRectangleCanvas.svelte';
	import DrawEraserTrail from './shapes/DrawEraserTrail.svelte';
	import * as PolyOps from './shapes/draw-utils/PolygonOperations';
	import {
		navBarState,
		mouseEventState,
		polygons,
		mostRecentChartID,
		mouseType,
		activeSidebar,
		allCharts,
		touchStates,
		activeDropZone
	} from '$lib/io/Stores';
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';
	import { resizeRectangle } from './shapes/draw-utils/Draw';
	import { generateID } from '$lib/io/GenerateID';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let scrollX: number = 0;
	let scrollY: number = 0;
	let width: number = 0;
	let height: number = 0;
	let newPolygon: Polygon[] = [];
	let eraserTrail: Point[] = [];

	let startPosition: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let currentTouchPosition: Point = { x: 0, y: 0 };

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let hoverIntersection: boolean = false;
	let handlePosition: HandlePosition;

	const tolerance: number = 5;

	$: chartIndex = $allCharts.findIndex((chart) => chart.chartID === $mostRecentChartID);
	$: TOUCHSTATE = touchStates();
	$: if ($TOUCHSTATE) controlSidebar($TOUCHSTATE);

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			updateOffset();
		});
	}

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	function controlSidebar(touchstate: string) {
		if (touchstate === 'isTouching') {
			activeSidebar.set(false);
		} else if (touchstate === 'isErasing') {
			activeSidebar.set(false);
		} else if (touchstate === 'isResizing' || touchstate === 'isTranslating') {
			activeSidebar.set(true);
		} else if (touchstate === 'isDrawing') {
			activeSidebar.set(true);
		}
	}

	/**
	 * ### Handle the touch start event.
	 *
	 * @param e MouseEvent
	 */
	const handleMouseDown = (e: MouseEvent): void => {
		var x = e.clientX - offsetX + scrollX;
		var y = e.clientY - offsetY + scrollY;
		startPosition = { x, y };

		mouseEventState.set('isTouching');
		const containingPolygon = PolyOps.getContainingPolygon(startPosition, $polygons);

		if ($navBarState === 'select' && chartIndex >= 0 && containingPolygon) {
			const polygon = $allCharts[chartIndex].polygon;
			if (polygon && PolyOps.isPointInPolygon(startPosition, polygon)) {
				if (polygon.id) mostRecentChartID.set(polygon.id);
				mouseEventState.set('isTranslating');
				return;
			} else {
				mouseEventState.set('isTouching');
				return;
			}
		}
	};

	/**
	 * ### Handle Touch End
	 *
	 * @param e MouseEvent
	 */
	const handleMouseUp = (e: MouseEvent) => {
		var x = e.clientX - offsetX + scrollX;
		var y = e.clientY - offsetY + scrollY;

		if ($TOUCHSTATE === 'isDrawing') {
			let targetId = generateID();
			const polygon = {
				id: targetId,
				vertices: [
					{ x: startPosition.x, y: startPosition.y },
					{ x: x, y: startPosition.y },
					{ x: x, y: y },
					{ x: startPosition.x, y: y }
				]
			};
			newPolygon = [];
			addChartMetaData(targetId, $navBarState, polygon);
		}

		mouseEventState.set('isHovering');
		navBarState.set('select');
	};

	/**
	 * ### Handle Mouse Move
	 *
	 * @param e MouseEvent
	 */
	const handleMouseMove = (e: MouseEvent) => {
		if ($TOUCHSTATE === 'isHovering') {
			handleMouseMoveUp(e.clientX, e.clientY);
		} else {
			handleMouseMoveDown(e.clientX, e.clientY);
		}
	};

	/**
	 * ### Handle Mouse Move
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleMouseMoveUp = (x: number, y: number): void => {
		x = x - offsetX + scrollX;
		y = y - offsetY + scrollY;
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;

		const polygons = $allCharts.map((chart) => chart.polygon);

		const polygon = polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, tolerance);
				$mouseType = PolyOps.getCursorStyleFromDirection(handlePosition);
				if (handlePosition) return true; // This will break the .find() loop
			}
			return false; // This will continue to the next item in the .find() loop
		});
		if (!polygon) {
			$mouseType = '';
		} else if (hoverPolygon && !$mouseType) {
			$mouseType = 'move';
		} else {
			$mouseType = $mouseType || 'default';
		}
	};

	/**
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleErase = (x: number, y: number): void => {
		currentTouchPosition = { x: x, y: y };
		handleEraseShape(x, y);
		const allPolygons = $allCharts.map((chart) => chart.polygon);
		const polygon = PolyOps.getContainingPolygon(currentTouchPosition, allPolygons);

		if (polygon) {
			allCharts.update((charts) => {
				const index = charts.findIndex((chart) => chart.polygon === polygon);
				if (index > -1) {
					charts.splice(index, 1);
				}
				return charts;
			});
		}
	};

	/**
	 * ### Create the shapes where charts will be put.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleCreateShapes = (x: number, y: number): void => {
		const polygon = {
			vertices: [
				{ x: startPosition.x, y: startPosition.y },
				{ x: x, y: startPosition.y },
				{ x: x, y: y },
				{ x: startPosition.x, y: y }
			]
		};
		newPolygon = [polygon];
	};

	/**
	 * ### Handle Erase Shape
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleEraseShape = (x: number, y: number): void => {
		eraserTrail = [...eraserTrail, { x: x, y: y }];
	};

	/**
	 * ### Handle Touch Resize
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleResize = (x: number, y: number) => {
		if (chartIndex !== null) {
			const polygon = $allCharts[chartIndex].polygon;
			$allCharts[chartIndex].polygon = resizeRectangle(x, y, polygon, handlePosition);
		}
	};

	/**
	 * ### Handle all touch movements
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleMouseMoveDown = (x: number, y: number): void => {
		x = x - offsetX + scrollX;
		y = y - offsetY + scrollY;

		switch ($TOUCHSTATE) {
			case 'isDrawing':
				handleCreateShapes(x, y);
				break;

			case 'isErasing':
				handleErase(x, y);
				break;

			case 'isResizing':
				handleResize(x, y);
				break;

			default:
				return;
		}
	};
</script>

<div class="background">
	<div
		class="h-full w-full"
		style={`cursor: ${$mouseType};`}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
	>
		<div id="canvasParent">
			{#if !$activeDropZone}
				{#each $allCharts as chart (chart.chartID)}
					<DrawRectangleCanvas polygon={chart.polygon} />
				{/each}
				{#each newPolygon as polygon}
					<DrawRectangleCanvas {polygon} />
				{/each}
			{/if}
		</div>
		<DrawEraserTrail />
	</div>
	<canvas bind:this={canvas} />
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
	.background {
		background-color: rgb(18, 18, 18);
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		position: fixed;
	}
</style>
