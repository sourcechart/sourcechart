<!-- Handle.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	export let x: number;
	export let y: number;
	export let size: number = 10;
	export let onDrag: (dx: number, dy: number) => void;

	let isDragging = false;
	let lastX = 0;
	let lastY = 0;

	onMount(() => {
		const handleMouseDown = (event: MouseEvent) => {
			isDragging = true;
			lastX = event.clientX;
			lastY = event.clientY;
		};
		const handleMouseUp = () => {
			isDragging = false;
		};
		const handleMouseMove = (event: MouseEvent) => {
			if (isDragging) {
				let dx = event.clientX - lastX;
				let dy = event.clientY - lastY;
				lastX = event.clientX;
				lastY = event.clientY;
				onDrag(dx, dy);
			}
		};
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div class="handle" style="left: {x}px; top: {y}px; width: {size}px; height: 20px;" />

<style>
	.handle {
		position: absolute;
		background-color: red;
		cursor: pointer;
	}
</style>
