<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import {
		mouseMove,
		touchStart,
		touchMove,
		trackMouseState,
		onMouseLeave
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
	import { redraw, drawRectangle } from './draw';

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
			if (context) redraw(polygons, context, width, height);
		}
	}

	const handleTouchMove = (x: number, y: number) => {
		console.log('touch move: ', x, ' ', y);
		if ($mouseEventState === 'isDrawing' && context) {
			if ($navBarState === 'drawRectangle') {
				redraw(polygons, context, width, height);
				drawRectangle(
					{
						id: id,
						vertices: [
							{ x: start.x, y: start.y },
							{ x: x, y: start.y },
							{ x: x, y: y },
							{ x: start.x, y: y }
						]
					},
					context
				);
			}
		}
	};

	const handleEnd = (x: number, y: number) => {
		if ($mouseEventState === 'isDrawing' && start) {
			mouseEventState.set('isHovering');
		}
	};

	const handleStart = (x: number, y: number) => {
		//check if the user is not currently drawing.
		let id = generateID();
		if ($navBarState && $mouseEventState !== 'isDrawing') {
			addChartMetaData(id, $navBarState);
			mouseEventState.set('isDrawing');
			start = { x, y };
		}
	};

	const onMouseMove = (x: number, y: number) => {
		console.log('hovering: ', x, y);
	};

	const onTouchMove = (x: number, y: number) => {
		console.log('touching: ', x, y);
	};
</script>

<canvas
	use:trackMouseState
	use:touchMove={{
		onMove: handleTouchMove
	}}
	use:mouseMove={{
		onMove: onMouseMove
	}}
	use:onMouseLeave={{
		onLeave: () => {
			console.log('leave');
		}
	}}
	use:touchStart={{
		onStart: handleStart
	}}
	class="container"
/>

<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>

<style>
	.container {
		height: 100vh;
		width: 100vw;
	}
</style>
