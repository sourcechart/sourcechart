<script lang="ts">
	import DrawRectangleCanvas from './shapes/DrawRectangleCanvas.svelte';
	import DrawUtils from './shapes/DrawUtils.svelte';
	import * as PolyOps from './draw-utils/PolygonOperations';
	import {
		navBarState,
		mostRecentChartID,
		touchType,
		touchState,
		activeSidebar,
		allCharts,
		canvasBehavior,
		activeDropZone,
		responsiveType
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

	$: console.log($CANVASBEHAVIOR, $touchType);
	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent): void => {
		let x;
		let y;
		if (e instanceof TouchEvent) {
			e.preventDefault();
			e.stopPropagation();
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else if (e instanceof MouseEvent) {
			x = e.clientX;
			y = e.clientY;
		} else {
			return;
		}

		startPosition = { x, y };
		touchState.set('isTouching');
	};

	const handleMouseUp = (e: MouseEvent | TouchEvent) => {
		let x: number;
		let y: number;

		if (e instanceof MouseEvent) {
			x = e.clientX;
			y = e.clientY;
			responsiveType.set('desktop');
		} else if (e instanceof TouchEvent) {
			responsiveType.set('mobile');
			x = e.changedTouches[0].clientX;
			y = e.changedTouches[0].clientY;
			e.preventDefault();
			e.stopPropagation();
		} else {
			return;
		}

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

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		let x: number;
		let y: number;

		if (e instanceof TouchEvent) {
			e.preventDefault();
			e.stopPropagation();
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
			handleMouseMoveUp(x, y);
		} else if (e instanceof MouseEvent) {
			x = e.clientX;
			y = e.clientY;
		} else {
			return;
		}
		if ($CANVASBEHAVIOR === 'isHovering') {
			handleMouseMoveUp(x, y);
		} else if ($CANVASBEHAVIOR !== 'isHovering') {
			handleMouseMoveDown(x, y);
		}
	};

	const handleMouseMoveUp = (x: number, y: number): void => {
		x = x - offsetX + scrollX;
		y = y - offsetY + scrollY;

		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygons = $allCharts.map((chart) => chart.polygon);

		polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon);
				var direction = PolyOps.getCursorStyleFromDirection(handlePosition);
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
			$allCharts[chartIndex].polygon = resizeRectangle(x, y, polygon, handlePosition);
		}
	};

	const handleMouseMoveDown = (x: number, y: number): void => {
		x = x - offsetX + scrollX;
		y = y - offsetY + scrollY;
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

<div class="bg-neutral-950 w-full h-full top-0 left-0 fixed">
	<div
		class="h-full w-full"
		style={`cursor: ${$touchType};`}
		on:mousedown={handleMouseDown}
		on:mousemove={handleMouseMove}
		on:mouseup={handleMouseUp}
		on:touchstart={handleMouseDown}
		on:touchmove={handleMouseMove}
		on:touchend={handleMouseUp}
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
/>
