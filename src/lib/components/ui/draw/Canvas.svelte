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
	import { redraw, drawRectangle } from './canvas-utils/draw';

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

	onMount(() => {
		context = canvas.getContext('2d');
		if (context) context.strokeStyle = 'red';

		width = window.innerWidth;
		height = window.innerHeight;
	});

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
	const handleTouchMove = (x: number, y: number) => {
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
			if (context) {
				context.strokeStyle = 'red';
				context.stroke();
			}
		}
		mouseEventState.set('isHovering');
	};

	const handleStart = (x: number, y: number) => {
		//check if the user is not currently drawing.
		id = generateID();
		if ($navBarState && $mouseEventState !== 'isDrawing') {
			addChartMetaData(id, $navBarState);
			mouseEventState.set('isDrawing');
			start = { x, y };
		}
	};
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
			onStart: handleStart
		}}
		use:touchEnd={{
			onEnd: handleEnd
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
