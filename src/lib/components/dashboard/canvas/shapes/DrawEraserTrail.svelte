<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let offsetX: number = 0;
	let offsetY: number = 0;
	let width: number = 0;
	let height: number = 0;

	export let eraserTrail: Point[] = [];

	$: console.log(eraserTrail);

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
</script>

<div class="absolute h-full w-full">
	<canvas bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
