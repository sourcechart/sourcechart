<script lang="ts">
	import { onMount } from 'svelte';

	export let width: number = 1000;
	export let height: number = 1000;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let isDrawing: boolean = false;
	let start: { x: number; y: number };

	let t: number, l: number;

	onMount(() => {
		context = canvas.getContext('2d');
		handleSize();
	});

	const handleStart = ({ offsetX: x, offsetY: y }: { offsetX: number; offsetY: number }) => {
		isDrawing = true;
		start = { x, y };
	};

	const handleEnd = (): void => {
		isDrawing = false;
		if (context) context.clearRect(0, 0, width, height); // Clear the canvas
	};

	const handleMove = ({ offsetX: x1, offsetY: y1 }: { offsetX: number; offsetY: number }) => {
		if (!isDrawing) return;

		const { x, y } = start;
		if (context) {
			context.clearRect(0, 0, width, height); // Clear the canvas before drawing
			context.beginPath();
			context.rect(x, y, x1 - x, y1 - y);
			context.stroke();
		}
	};

	const handleSize = (): void => {
		const { top, left } = canvas.getBoundingClientRect();
		t = top;
		l = left;
	};
</script>

<svelte:window on:resize={handleSize} />

<canvas
	{width}
	{height}
	bind:this={canvas}
	on:mousedown={handleStart}
	on:touchstart={(e) => {
		const { clientX, clientY } = e.touches[0];
		handleStart({
			offsetX: clientX - l,
			offsetY: clientY - t
		});
	}}
	on:mouseup={handleEnd}
	on:touchend={handleEnd}
	on:mouseleave={handleEnd}
	on:mousemove={handleMove}
	on:touchmove={(e) => {
		const { clientX, clientY } = e.touches[0];
		handleMove({
			offsetX: clientX - l,
			offsetY: clientY - t
		});
	}}
/>
