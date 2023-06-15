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
	let start: Point = { x: 0, y: 0 };
	let rectangles: Rect[] = [];
	let selectedRectIndex: number | null = null;

	onMount(() => {
		context = canvas.getContext('2d');
		width = window.innerWidth;
		height = window.innerHeight;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
				selectedRectIndex !== null
			) {
				rectangles.splice(selectedRectIndex, 1);
				selectedRectIndex = null;
				redraw();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const redraw = (): void => {
		if (context) {
			context.clearRect(0, 0, width, height);
			rectangles.forEach(drawRect);
		}
	};

	const drawRect = (rect: Rect, index: number): void => {
		if (context) {
			context.beginPath();
			context.rect(rect.x, rect.y, rect.width, rect.height);
			context.strokeStyle = selectedRectIndex === index ? 'red' : 'black';
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

	const handleClick = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		selectedRectIndex = rectangles.findIndex(
			(rect) => x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height
		);
	};

	const handleMove = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		if (!isDrawing) return;
		if (context) {
			context.clearRect(0, 0, width, height); // Clear the canvas before drawing
			rectangles.forEach(drawRect); // Draw all the completed rectangles
			drawRect(
				{ x: start.x, y: start.y, width: x - start.x, height: y - start.y },
				rectangles.length
			); // Draw current rectangle
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
	on:click={handleClick}
>
	<slot />
</canvas>
