<script lang="ts">
	import { onMount } from 'svelte';
	export let x: number;
	export let y: number;
	export let size: number = 10;
	export let onDrag: (dx: number, dy: number) => void;

	let isDragging = false;
	let lastX = 0;
	let lastY = 0;
	let handle: HTMLDivElement; // add this line

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
		handle.addEventListener('mousedown', handleMouseDown); // update this line
		handle.addEventListener('mouseup', handleMouseUp); // update this line
		handle.addEventListener('mousemove', handleMouseMove); // update this line
		return () => {
			handle.removeEventListener('mousedown', handleMouseDown); // update this line
			handle.removeEventListener('mouseup', handleMouseUp); // update this line
			handle.removeEventListener('mousemove', handleMouseMove); // update this line
		};
	});
</script>

<div
	bind:this={handle}
	class="handle"
	style="left: {x}px; top: {y}px; width: {size}px; height: 20px;"
/>

<style>
	.handle {
		position: absolute;
		background-color: red;
		cursor: pointer;
	}
</style>
