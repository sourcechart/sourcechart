<script lang="ts">
	import DrawRectangleCanvas from './shapes/DrawRectangleCanvas.svelte';
	import * as PolyOps from './shapes/draw-utils/PolygonOperations';
	import * as MouseActions from '$lib/actions/MouseActions';

	import { navBarState, mouseEventState, polygons, mostRecentChartID } from '$lib/io/Stores';
	import { resizeRectangle } from './shapes/draw-utils/Draw';
	import { generateID } from '$lib/io/GenerateID';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let width: number = 0;
	let height: number = 0;

	let newPolygon: Polygon[] = [];

	let selectedPolygonIndex: number | null = null;
	let start: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let hoverIntersection: boolean = false;
	let handlePosition: HandlePosition;
	let cursorClass: string | null;

	const tolerance: number = 5;
	const highlightcolor: string = 'red';
	const defaultcolor: string = 'black ';

	$: selectedPolygonIndex = $polygons.findIndex((p) => p.id === $mostRecentChartID);

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			const rect = canvas.getBoundingClientRect();
			offsetX = rect.left;
			offsetY = rect.top;
			console.log(offsetX, offsetY);
		});
	}

	/**
	 * ### Handle the touch start event.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchStart = (x: number, y: number): void => {
		mouseEventState.set('isTouching');
		start = { x, y };
		const currentPoint: Point = { x, y };
		const containingPolygon = PolyOps.getContainingPolygon(currentPoint, $polygons);

		containingPolygon?.id ? mostRecentChartID.set(containingPolygon.id) : mostRecentChartID.set('');

		if ($navBarState === 'select' && selectedPolygonIndex !== null) {
			const polygon = $polygons[selectedPolygonIndex];
			if (polygon && PolyOps.isPointInPolygon({ x, y }, polygon)) {
				dragOffset = { x, y };
				mouseEventState.set('isTranslating');
				return;
			}
		}
	};

	/**
	 * ### Handle all touch movements
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchMove = (x: number, y: number): void => {
		if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
			handleTouchCreateShapes(x, y);
		}
		if ($navBarState === 'eraser' && $mouseEventState === 'isTouching') {
			handleTouchErase(x, y);
		}
		if ($navBarState === 'select' && $mouseEventState === 'isTouching' && cursorClass === 'move') {
			handleTranslate(x, y);
		}
		if (
			$navBarState === 'select' &&
			$mouseEventState === 'isTouching' &&
			cursorClass !== 'move' &&
			cursorClass
		) {
			handleTouchResize(x, y);
		}
	};

	/**
	 * ### Create the shapes where charts will be put.
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
	 */
	const handleTouchCreateShapes = (xWithOffset: number, yWithOffset: number): void => {
		if ($navBarState === 'drawRectangle') {
			const polygon = {
				vertices: [
					{ x: start.x, y: start.y },
					{ x: xWithOffset, y: start.y },
					{ x: xWithOffset, y: yWithOffset },
					{ x: start.x, y: yWithOffset }
				]
			};
			newPolygon = [polygon];
		}
	};

	/**
	 * ### Handle Touch Resize
	 *
	 * @param x
	 * @param y
	 */
	const handleTouchResize = (x: number, y: number) => {
		if (selectedPolygonIndex !== null) {
			const polygon = $polygons[selectedPolygonIndex];
			$polygons[selectedPolygonIndex] = resizeRectangle(x, y, polygon, handlePosition);
		}
	};

	/**
	 * ### Handle Touch Translate
	 *
	 * @param x
	 * @param y
	 */
	const handleTranslate = (x: number, y: number) => {
		if (selectedPolygonIndex !== null) {
			const dx = x - dragOffset.x;
			const dy = y - dragOffset.y;
			const polygon = $polygons[selectedPolygonIndex];
			polygon.vertices = polygon.vertices.map((vertex) => {
				return { x: vertex.x + dx, y: vertex.y + dy };
			});
			dragOffset = { x: x, y: y };
			$polygons[selectedPolygonIndex] = polygon;
		}
	};

	/**
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchErase = (x: number, y: number): void => {
		const currentTouchPoint: Point = { x: x, y: y };
		const polygon = PolyOps.getContainingPolygon(currentTouchPoint, $polygons);
		const index = polygon ? $polygons.indexOf(polygon) : -1;
		if (index > -1) {
			$polygons.splice(index, 1);
		}
	};

	/**
	 * ### Handle Touch End
	 *
	 * @param x X position on the screen
	 * @param y Y position on the screen
	 */
	const handleTouchEnd = (x: number, y: number) => {
		if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
			let targetId = generateID();
			const polygon = {
				id: targetId,
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			};
			newPolygon = [];
			$polygons = [...$polygons, polygon];
		}
		mouseEventState.set('isHovering');
		navBarState.set('select');
		mostRecentChartID.set('');
	};

	/**
	 * ### Handle Mouse Move
	 *
	 * @param x
	 * @param y
	 */
	const handleMouseMove = (x: number, y: number): void => {
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygon = $polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, tolerance);
				cursorClass = PolyOps.getCursorStyleFromDirection(handlePosition);
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
</script>

<div
	class="h-full w-full"
	style={`cursor: ${cursorClass};`}
	use:MouseActions.trackMouseState
	on:keydown={() => {
		null;
	}}
	use:MouseActions.mouseMove={{
		onMove: handleMouseMove
	}}
	use:MouseActions.touchStart={{
		onStart: handleTouchStart
	}}
	use:MouseActions.touchMove={{
		onMove: handleTouchMove
	}}
	use:MouseActions.touchEnd={{
		onEnd: handleTouchEnd
	}}
>
	<div id="canvasParent">
		{#each $polygons as polygon}
			<DrawRectangleCanvas {polygon} {defaultcolor} {highlightcolor} />
		{/each}
		{#each newPolygon as polygon}
			<DrawRectangleCanvas {polygon} {defaultcolor} {highlightcolor} />
		{/each}
	</div>
</div>
<canvas bind:this={canvas} />
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
