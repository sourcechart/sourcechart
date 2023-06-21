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
		mouseEventState
	} from '$lib/io/stores';
	import { generateID } from '$lib/io/generateID';
	import { addChartMetaData } from '$lib/io/chartMetaDataManagement';

	import { redraw, drawRectangle, drawHandles } from './canvas-utils/draw';
	import { getContainingPolygon } from './canvas-utils/polygonOperations';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let id: string;
	let width: number;
	let height: number;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let selectedPolygonIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point;
	let dragOffset: Point = { x: 0, y: 0 };

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
		});
	}

	function removeChart() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (
			(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
			selectedPolygonIndex !== null
		) {
			removeChart();
			$activeSidebar = false;
			polygons.splice(selectedPolygonIndex, 1);
			selectedPolygonIndex = null;
		}
	}
	const onMOuseMove = (x: number, y: number): void => {};

	const handleTouchStart = (x: number, y: number): void => {
		//check if the user is not currently drawing.
		id = generateID();
		if ($mouseEventState !== 'isTouching') {
			addChartMetaData(id, $navBarState);
			mouseEventState.set('isTouching');
			start = { x, y };
		}
	};

	const handleTouchMove = (x: number, y: number): void => {
		if (context && $mouseEventState === 'isTouching') {
			if ($navBarState === 'drawRectangle') {
				handleTouchCreateShapes(x, y, context);
			} else if ($navBarState === 'eraser') {
				handleTouchErase(x, y, context);
			} else if ($navBarState === 'select') {
				console.log('foo');
			}
		}
	};

	const handleTouchCreateShapes = (
		x: number,
		y: number,
		context: CanvasRenderingContext2D
	): void => {
		if ($navBarState === 'drawRectangle') {
			redraw(polygons, context, width, height);
			const polygon = {
				id: id,
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			};
			drawRectangle(polygon, context);
		}
	};

	const handleTouchErase = (x: number, y: number, context: CanvasRenderingContext2D): void => {
		const currentTouchPoint: Point = { x, y };
		const polygon = getContainingPolygon(currentTouchPoint, polygons);
		const index = polygon ? polygons.indexOf(polygon) : -1;
		if (index > -1) {
			polygons.splice(index, 1);
		}
		redraw(polygons, context, width, height);
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
			if (context) addHandleToShape(polygon, 'red', context);
		}
		mouseEventState.set('isHovering');
	};

	function addHandleToShape(
		polygon: Polygon,
		lineColor: string,
		context: CanvasRenderingContext2D
	) {
		context.strokeStyle = lineColor;
		context.stroke();
		drawHandles(polygon, context);
	}
</script>

<div {id}>
	<canvas
		use:trackMouseState
		use:touchMove={{
			onMove: handleTouchMove
		}}
		use:onMouseLeave={{
			onLeave: () => {
				console.log('leave');
			}
		}}
		use:touchStart={{
			onStart: handleTouchStart
		}}
		use:touchEnd={{
			onEnd: handleTouchEnd
		}}
		bind:this={canvas}
		{width}
		{height}
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
