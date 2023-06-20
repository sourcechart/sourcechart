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
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let width: number;
	let height: number;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let selectedPolygonIndex: number | null = null;
	let polygons: Polygon[] = [];
	let start: Point;

	$: navBarMode = $navBarState;

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
			redraw();
		}
	}

	const handleDrawingStart = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		if (context && navBarMode === 'drawRectangle') {
			drawInteraction.set('isDragging');
			start = { x, y };
		}
	};

	const redraw = (): void => {
		if (context) {
			context.clearRect(0, 0, width, height);
			polygons.forEach(drawRectangle);
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
	use:touchStart={{
		onStart: () => {
			console.log('foo');
		}
	}}
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
