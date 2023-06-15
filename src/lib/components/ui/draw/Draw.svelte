<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let isDrawing: boolean = false;
	let startX: number = 0;
	let startY: number = 0;
	let rectangles: { x: number; y: number; width: number; height: number }[] = [];

	const dispatch = createEventDispatcher();

	function drawRect(rect: { x: number; y: number; width: number; height: number }) {
		if (ctx) {
			ctx.fillStyle = 'rgba(0,0,0,0)'; // Transparent fill
			ctx.strokeStyle = '#000000'; // Black outline
			ctx.beginPath();
			ctx.rect(rect.x, rect.y, rect.width, rect.height);
			ctx.fill();
			ctx.stroke();
		}
	}

	onMount(() => {
		ctx = canvas.getContext('2d');

		const onMouseDown = (e: MouseEvent) => {
			isDrawing = true;
			startX = e.clientX - canvas.getBoundingClientRect().left;
			startY = e.clientY - canvas.getBoundingClientRect().top;
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') {
				dispatch('remove');
			}
		};

		const onMouseMove = (e: MouseEvent) => {
			if (!isDrawing) return;
			let mouseX: number = e.clientX - canvas.getBoundingClientRect().left;
			let mouseY: number = e.clientY - canvas.getBoundingClientRect().top;
			if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
			rectangles.forEach(drawRect); // Draw all the completed rectangles
			drawRect({
				x: Math.min(mouseX, startX),
				y: Math.min(mouseY, startY),
				width: Math.abs(mouseX - startX),
				height: Math.abs(mouseY - startY)
			});
		};

		const onMouseUp = (e: MouseEvent) => {
			isDrawing = false;
			let mouseX: number = e.clientX - canvas.getBoundingClientRect().left;
			let mouseY: number = e.clientY - canvas.getBoundingClientRect().top;
			rectangles.push({
				x: Math.min(mouseX, startX),
				y: Math.min(mouseY, startY),
				width: Math.abs(mouseX - startX),
				height: Math.abs(mouseY - startY)
			});
		};

		window.addEventListener('keydown', onKeyDown);
		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mouseup', onMouseUp);

		return () => {
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mouseup', onMouseUp);
			window.removeEventListener('keydown', onKeyDown);
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
