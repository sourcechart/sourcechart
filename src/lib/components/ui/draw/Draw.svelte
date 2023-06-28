<script lang="ts">
	import DrawRectangleCanvas from './shapes/DrawRectangleCanvas.svelte';
	import * as PolyOps from './canvas-utils/PolygonOperations';
	import * as MouseActions from '$lib/actions/MouseActions';

	import { navBarState, mouseEventState } from '$lib/io/Stores';
	import { generateID } from '$lib/io/GenerateID';

	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	let width: number = 0;
	let height: number = 0;

	//let context: CanvasRenderingContext2D | null;
	let canvas: HTMLCanvasElement;

	const polygons = writable<Polygon[]>([]);
	let newPolygon: Polygon[] = [];

	let selectedPolygonIndex: number | null = null;
	let start: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };
	let hoverIntersection: boolean = false;

	let cursorClass: string | null;
	let offsetX: number = 0;
	let offsetY: number = 0;
	let handlePosition: HandlePosition;

	let prevPolygonsLength = 0;

	const tolerance: number = 5;
	const handleRadius: number = 5;
	$: console.log($polygons);

	if (browser) {
		onMount(() => {
			width = window.innerWidth;
			height = window.innerHeight;
			const rect = canvas.getBoundingClientRect();
			offsetX = rect.left - handleRadius;
			offsetY = rect.top - handleRadius;
		});
	}

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
	 * ### Handle the touch start event.
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchStart = (x: number, y: number): void => {
		x = x - offsetX;
		y = y - offsetY;
		if ($navBarState === 'select' && selectedPolygonIndex !== null) {
			const polygon = $polygons[selectedPolygonIndex];
			if (polygon && PolyOps.isPointInPolygon({ x, y }, polygon)) {
				dragOffset = { x, y };
				mouseEventState.set('isTranslating');
				return;
			}
		}
		if ($mouseEventState !== 'isTouching') {
			if (checkNewRectangle($polygons)) {
			}
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

	/**
	 * ### Handle all touch movements
	 *
	 * @param x x position on the screen
	 * @param y y position on the screen
	 */
	const handleTouchMove = (x: number, y: number): void => {
		x = x - offsetX;
		y = y - offsetY;

		if ($navBarState === 'drawRectangle' && $mouseEventState === 'isTouching') {
			handleTouchCreateShapes(x, y);
		}

		if ($navBarState === 'eraser' && $mouseEventState === 'isTouching') {
			handleTouchErase(x, y);
		}

		/*if (
			$navBarState === 'select' &&
			$mouseEventState === 'isTranslating' &&
			cursorClass === 'move' &&
			selectedPolygonIndex !== null
		) {
			handleTouchTranslate(x, y); // context);, selectedPolygonIndex, HIGHLIGHTCOLOR);
		} */
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
	 * ### On intersection of a polygon while your mouse is touching erase
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
	 */
	const handleTouchErase = (xWithOffset: number, yWithOffset: number): void => {
		const currentTouchPoint: Point = { x: xWithOffset, y: yWithOffset };
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
		x = x - offsetX;
		y = y - offsetY;

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
			$polygons = [...$polygons, polygon];
		}
		mouseEventState.set('isHovering');
		navBarState.set('select');
	};
</script>

<div
	class="h-full w-full"
	on:keydown={() => {
		null;
	}}
	use:MouseActions.trackMouseState
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
	{#each $polygons as polygon}
		<DrawRectangleCanvas {polygon} />
	{/each}
	<!--	

	{#each newPolygon as polygon}
		<DrawRectangleCanvas {polygon} {width} {height} {offsetX} {offsetY} />
	{/each}
	-->
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
