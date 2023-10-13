<script lang="ts">
	import DrawRectangleCanvas from './shapes/DrawRectangleCanvas.svelte';
	import DrawUtils from './shapes/DrawUtils.svelte';
	import * as PolyOps from './draw-utils/PolygonOperations';
	import {
		navBarState,
		mostRecentChartID,
		touchType,
		touchState,
		allCharts,
		canvasBehavior,
		activeDropZone
		//responsiveType
	} from '$lib/io/Stores';
	import { addChartMetaData } from '$lib/io/ChartMetaDataManagement';
	import { resizeRectangle } from './draw-utils/Draw';
	import { generateID } from '$lib/io/GenerateID';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let scrollX: number = 0;
	let scrollY: number = 0;
	let width: number = 0;
	let height: number = 0;
	let newPolygon: Polygon[] = [];
	let touchStartedOnHandle = false;

	let eraserTrail: Point[] = [];

	let startPosition = { x: 0, y: 0 };
	let currentMousePosition = { x: 0, y: 0 };
	let currentTouchPosition = { x: 0, y: 0 };

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let hoverIntersection: boolean = false;
	let handlePosition: HandlePosition;

	$: chartIndex = $allCharts.findIndex((chart) => chart.chartID === $mostRecentChartID);
	$: CANVASBEHAVIOR = canvasBehavior();

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			updateOffset();
		});
	}

	let debounceTimer: number | undefined;

	const debouncedHandleMouseMoveUp = (x: number, y: number): void => {
		clearTimeout(debounceTimer);
		debounceTimer = window.setTimeout(() => handleMouseMoveUp(x, y), 5);
	};

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const handlePointerDown = (e: PointerEvent): void => {
		let x = e.clientX - offsetX + scrollX;
		let y = e.clientY - offsetY + scrollY;

		startPosition = { x, y };

		// Check if touch/mouse down started on a handle
		const polygons = $allCharts.map((chart) => chart.polygon);
		for (let polygon of polygons) {
			const handlePosition = PolyOps.getHandlesHovered({ x, y }, polygon);
			if (handlePosition !== 'center' || handlePosition !== null) {
				touchStartedOnHandle = true;
				break;
			}
		}

		touchState.set('isTouching');
		document.addEventListener('pointermove', handlePointerMove);
		document.addEventListener('pointerup', handlePointerUp);
	};

	const handlePointerUp = (e: PointerEvent) => {
		let x = e.clientX - offsetX + scrollX;
		let y = e.clientY - offsetY + scrollY;

		x = x - offsetX + scrollX;
		y = y - offsetY + scrollY;

		if ($CANVASBEHAVIOR === 'isDrawing') {
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

		touchState.set('isHovering');
		navBarState.set('select');
	};

	const handlePointerMove = (e: PointerEvent) => {
		let x = e.clientX - offsetX + scrollX;
		let y = e.clientY - offsetY + scrollY;

		/*
		if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
			x = e.touches[0].clientX; //@ts-ignore
			y = e.touches[0].clientY;
			handleTouchMove(x, y);
		} else if (e instanceof MouseEvent) {
			x = e.clientX;
			y = e.clientY;
			x = x - offsetX + scrollX;
			y = y - offsetY + scrollY;
		} else {
			return;
		}*/

		if ($CANVASBEHAVIOR === 'isHovering') {
			debouncedHandleMouseMoveUp(x, y);
		} else {
			handleMouseMoveDown(x, y);
		}
	};

	const handleTouchMove = (x: number, y: number): void => {
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygons = $allCharts.map((chart) => chart.polygon);
		let direction: string;
		polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon && touchStartedOnHandle) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, true);
				direction = PolyOps.getCursorStyleFromDirection(handlePosition);
				touchType.set(direction);
				if (handlePosition) return true;
			}
		});
	};

	const handleMouseMoveUp = (x: number, y: number): void => {
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygons = $allCharts.map((chart) => chart.polygon);
		let direction: string;
		polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon && touchStartedOnHandle) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, false);
				direction = PolyOps.getCursorStyleFromDirection(handlePosition);
				touchType.set(direction);
				if (handlePosition) return true;
			} else {
				touchType.set('default');
			}
		});
	};

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

	const handleCreateShapes = (x: number, y: number): void => {
		const polygon = {
			vertices: [
				{ x: startPosition.x, y: startPosition.y },
				{ x: x, y: startPosition.y },
				{ x: x, y: y },
				{ x: startPosition.x, y: y }
			]
		};
		if ($CANVASBEHAVIOR === 'isDrawing') {
			newPolygon = [polygon];
		}
	};

	const handleEraseShape = (x: number, y: number): void => {
		eraserTrail = [...eraserTrail, { x: x, y: y }];
	};

	const handleResize = (x: number, y: number) => {
		if (chartIndex !== null) {
			const polygon = $allCharts[chartIndex].polygon;
			const newPolygon = resizeRectangle(x, y, polygon, handlePosition);
			$allCharts[chartIndex].polygon = newPolygon;
		}
	};

	const handleMouseMoveDown = (x: number, y: number): void => {
		switch ($CANVASBEHAVIOR) {
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

<div class="w-full h-full top-0 left-0 fixed">
	<div class="h-full w-full" style={`cursor: ${$touchType};`}>
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
		<DrawUtils />
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
	on:pointerdown={handlePointerDown}
	on:pointermove={handlePointerMove}
	on:pointerup={handlePointerUp}
/>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
