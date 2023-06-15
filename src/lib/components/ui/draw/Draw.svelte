<script lang="ts">
	import { onMount } from 'svelte';

	interface Rect {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	interface Point {
		x: number;
		y: number;
	}

	interface MouseEventExtended extends MouseEvent {
		offsetX: number;
		offsetY: number;
	}

	let width: number;
	let height: number;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let isDrawing: boolean = false;
	let start: Point;
	let rectangles: Rect[] = [];

	onMount(() => {
		context = canvas.getContext('2d');
		width = window.innerWidth;
		height = window.innerHeight;
	});

	const drawRect = (rect: Rect): void => {
		if (context) {
			context.beginPath();
			context.rect(rect.x, rect.y, rect.width, rect.height);
			context.stroke();
		}
	};

	const handleStart = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		isDrawing = true;
		start = { x, y };
	};

	const handleEnd = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		isDrawing = false;
		rectangles.push({
			x: start.x,
			y: start.y,
			width: x - start.x,
			height: y - start.y
		});
	};

	const handleMove = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		if (!isDrawing) return;
		if (context) {
			context.clearRect(0, 0, width, height); // Clear the canvas before drawing
			rectangles.forEach(drawRect); // Draw all the completed rectangles
			drawRect({ x: start.x, y: start.y, width: x - start.x, height: y - start.y }); // Draw current rectangle
		}
	};
</script>

<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>

<canvas
	{width}
	{height}
	bind:this={canvas}
	on:mousedown={handleStart}
	on:mouseup={handleEnd}
	on:mousemove={handleMove}
/>
