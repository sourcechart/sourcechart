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
		drawInteraction
	} from '$lib/io/stores';

	import { redraw, drawRectangle } from './draw';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let width: number;
	let height: number;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let selectedPolygonIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point;

	$: mode = $navBarState;

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

	const handleDrawingStart = (x: number, y: number) => {
		console.log('foo');
		if (context && $drawInteraction !== 'isDrawing') {
			drawInteraction.set('isDragging');
			start = { x, y };
		}
	};
</script>

<div
	use:trackMouseState
	use:touchMove={{
		onMove: () => {
			console.log('foo');
		}
	}}
	use:touchStart={{ onStart: handleDrawingStart }}
	use:mouseMove={{
		onMove: () => {
			console.log('foo');
		}
	}}
	use:onMouseLeave={{
		onLeave: () => {
			console.log('foo');
		}
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
