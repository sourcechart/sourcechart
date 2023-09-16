<script lang="ts">
	import { onMount } from 'svelte';
	import { drawingBehavior } from '$lib/io/Stores';
	import rough from 'roughjs/bin/rough';

	let canvas: HTMLCanvasElement;
	let roughCanvas: any;
	let startX: number = 0;
	let startY: number = 0;
	let endX: number = 0;
	let endY: number = 0;
	let width: number = 0;
	let height: number = 0;

	$: DRAWINGBEHAVIOR = drawingBehavior();

	onMount(() => {
		roughCanvas = rough.canvas(canvas);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
	});

	const drawArrow = (): void => {
		const context = canvas.getContext('2d');
		if (!context) return;

		// Clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		// Draw the arrow shaft using rough.js
		roughCanvas.line(startX, startY, endX, endY, {
			stroke: 'white',
			strokeWidth: 0.5,
			roughness: 0.4
		});

		const angle: number = Math.atan2(endY - startY, endX - startX);
		const arrowLength: number = 10;
		const headX1: number = endX - arrowLength * Math.cos(angle + Math.PI / 6);
		const headY1: number = endY - arrowLength * Math.sin(angle + Math.PI / 6);
		const headX2: number = endX - arrowLength * Math.cos(angle - Math.PI / 6);
		const headY2: number = endY - arrowLength * Math.sin(angle - Math.PI / 6);

		const pathString: string = `M ${endX} ${endY} L ${headX1} ${headY1} L ${headX2} ${headY2} Z`;
		roughCanvas.path(pathString, {
			stroke: 'white',
			fill: 'white',
			strokeWidth: 0.5,
			roughness: 0.4
		});
	};

	const handleStart = (e: MouseEvent | TouchEvent): void => {
		if (e instanceof TouchEvent && e.touches.length) {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		} else if (e instanceof MouseEvent) {
			startX = e.clientX;
			startY = e.clientY;
		}
	};

	const handleMove = (e: MouseEvent | TouchEvent): void => {
		if ($DRAWINGBEHAVIOR !== 'drawArrow') return;

		if (e instanceof TouchEvent && e.touches.length) {
			endX = e.touches[0].clientX;
			endY = e.touches[0].clientY;
		} else if (e instanceof MouseEvent) {
			endX = e.clientX;
			endY = e.clientY;

			console.log('endX: ', endX, endY);
		}
		drawArrow();
	};
</script>

<!--
<div
	class="absolute h-full w-full"
	on:mousedown={handleStart}
	on:mousemove={handleMove}
	on:touchstart={handleStart}
	on:touchmove={handleMove}
>
	<canvas style="position: absolute;" bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
			if (canvas) {
				canvas.width = width;
				canvas.height = height;
			}
		}
	}}
/>
-->
