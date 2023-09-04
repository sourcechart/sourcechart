<script lang="ts">
	import { touchStates } from '$lib/io/Stores';
	import { onMount, afterUpdate } from 'svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];

	onMount(() => {
		context = canvas.getContext('2d');
	});

	let TOUCHSTATE = touchStates();

	const drawEraserTrail = (
		mouseTrail: Point[],
		context: CanvasRenderingContext2D,
		lineColor: string
	): void => {
		if (mouseTrail.length < 2) return;

		context.beginPath();
		context.moveTo(0, 0);
		for (let i = 1; i < mouseTrail.length; i++) {
			context.lineTo(mouseTrail[i].x, mouseTrail[i].y);
		}
		context.stroke();
	};

	const handleMouseMove = (e: MouseEvent) => {
		if ($TOUCHSTATE !== 'isErasing') return;
		eraserTrail = [...eraserTrail, { x: e.clientX, y: e.clientY }];
		if (context) drawEraserTrail(eraserTrail, context, 'red');
	};

	const handleMouseUp = () => {
		if ($TOUCHSTATE !== 'isErasing') return;
		eraserTrail = [];
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
				canvas.width = width;
				canvas.height = height;
			}
		}
	}}
/>
