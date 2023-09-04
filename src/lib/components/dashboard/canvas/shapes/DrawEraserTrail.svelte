<script lang="ts">
	import { touchStates } from '$lib/io/Stores';
	import { onMount, afterUpdate } from 'svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];
	let touchState = touchStates();
	let offsetX: number = 0;
	let offsetY: number = 0;

	onMount(() => {
		context = canvas.getContext('2d');
		width = window.innerWidth;
		height = window.innerHeight;
		updateOffset();
		canvas.width = width;
		canvas.height = height;
	});

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const drawEraserTrail = (
		mouseTrail: Point[],
		context: CanvasRenderingContext2D,
		lineColor: string
	): void => {
		if (mouseTrail.length < 2) return;
		context.beginPath();
		context.strokeStyle = lineColor;
		for (let i = 1; i < mouseTrail.length; i++) {
			context.moveTo(mouseTrail[i - 1].x, mouseTrail[i - 1].y);
			context.lineTo(mouseTrail[i].x, mouseTrail[i].y);
			context.stroke();
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if ($touchState !== 'isErasing') return;
		eraserTrail = [...eraserTrail, { x: e.clientX, y: e.clientY }];
		if (context) drawEraserTrail(eraserTrail, context, 'red');
	};

	const handleMouseUp = () => {
		if ($touchState !== 'isErasing') return;
		eraserTrail = [];
		if (context) drawEraserTrail(eraserTrail, context, 'red');
	};
</script>

<div class="absolute h-full w-full" on:mousemove={handleMouseMove} on:mouseup={handleMouseUp}>
	<canvas style="position: absolute; z-index: 2;" bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
			if (canvas) {
			}
		}
	}}
/>
