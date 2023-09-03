<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import { browser } from '$app/environment';
	import { drawMouseTrail } from './draw-utils/Draw';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;
	let width: number = 0;
	let height: number = 0;

	export let eraserTrail: Point[] = [];

	$: if (eraserTrail.length > 2 && context) {
		drawMouseTrail(eraserTrail, context, 'red');
	}

	if (browser) {
		onMount(() => {
			context = canvas.getContext('2d');
			width = window.innerWidth;
			height = window.innerHeight;
			updateOffset();
		});
	}

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	afterUpdate(() => {
		if (context) drawMouseTrail(eraserTrail, context, 'red');
	});
</script>

<div class="absolute h-full w-full">
	<canvas bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
			updateOffset();
		}
	}}
/>

<style>
	canvas {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
