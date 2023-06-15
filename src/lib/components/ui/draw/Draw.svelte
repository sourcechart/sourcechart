<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let isDrawing: boolean = false;
	let startX: number = 0;
	let startY: number = 0;

	onMount(() => {
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

			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = 'rgba(0,0,0,0)'; // Transparent fill
				ctx.strokeStyle = '#000000'; // Black outline
				ctx.beginPath();
				ctx.rect(
					Math.min(mouseX, startX),
					Math.min(mouseY, startY),
					Math.abs(mouseX - startX),
					Math.abs(mouseY - startY)
				);
				ctx.fill();
				ctx.stroke();
			}
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
		height: 100vh;
		width: 100vw;
	}
</style>
