<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { clearChartOptions, allCharts, mostRecentChartID, activeSidebar } from '$lib/io/Stores';
	import { redraw, drawRectangle, drawHandles, resizeRectangle } from '../canvas-utils/Draw';

	export let polygon: Polygon;

	export let width: number;
	export let height: number;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;

	onMount(() => {
		context = canvas.getContext('2d');

		if (context) {
			const rect = canvas.getBoundingClientRect();
			offsetX = rect.left; //- handleRadius;
			offsetY = rect.top; //- handleRadius;
			let startX = polygon.vertices[0].x - offsetX;
			let startY = polygon.vertices[0].y - offsetY;
			let rectWidth = polygon.vertices[2].x - startX;
			let rectHeight = polygon.vertices[2].y - startY;
			context.strokeStyle = 'red';
			context.strokeRect(startX, startY, rectWidth, rectHeight);
		}
	});
</script>

<div id={polygon.id}>
	<canvas bind:this={canvas} {width} {height} />
</div>
