<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	export let width: number;
	export let height: number;
	export let rectangles: any[] = [];
	export let selectedRectIndex: number | null = null;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	onMount(() => {
		context = canvas.getContext('2d');
		afterUpdate(() => {
			if (context) {
				context.clearRect(0, 0, width, height);
				rectangles.forEach(drawRect);
			}
		});
	});

	const drawRect = (rect: any, index: number): void => {
		if (context) {
			context.beginPath();
			context.rect(rect.x, rect.y, rect.width, rect.height);
			context.strokeStyle = selectedRectIndex === index ? 'red' : 'black';
			context.stroke();
		}
	};
</script>

<canvas {width} {height} bind:this={canvas} />
