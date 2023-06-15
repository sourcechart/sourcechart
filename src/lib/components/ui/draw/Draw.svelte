<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDrawing: boolean = false;
	let startX: number = 0;
	let startY: number = 0;

	onMount(() => {
		//@ts-ignore
		ctx = canvas.getContext('2d');

		const onMouseDown = (e: MouseEvent) => {
			isDrawing = true;
			startX = e.clientX - canvas.getBoundingClientRect().left;
			startY = e.clientY - canvas.getBoundingClientRect().top;
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDrawing) return;
			let mouseX: number = e.clientX - canvas.getBoundingClientRect().left;
			let mouseY: number = e.clientY - canvas.getBoundingClientRect().top;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#000000';
			ctx.fillRect(
				Math.min(mouseX, startX),
				Math.min(mouseY, startY),
				Math.abs(mouseX - startX),
				Math.abs(mouseY - startY)
			);
		};

		const onMouseUp = () => {
			isDrawing = false;
		};

		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mouseup', onMouseUp);

		return () => {
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>

<canvas bind:this={canvas} class="w-full h-full" />

<style>
	canvas {
		margin: auto;
		display: block;
		box-shadow: 0px 2px 12px -2px rgba(0, 0, 0, 0.15);
		height: 100vh; /* Make sure the canvas has a height */
		width: 100vw; /* Make sure the canvas has a width */
	}
</style>
