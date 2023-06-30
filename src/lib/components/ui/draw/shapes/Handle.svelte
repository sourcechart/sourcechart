<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let x: number;
	export let y: number;
	export let size: number = 10;
	export let onDrag: (dx: number, dy: number) => void;
	export let handlePosition: string = 'default';

	let isDragging = false;
	let lastX = 0;
	let lastY = 0;
	let handle: HTMLDivElement; // add this line

	const getCursor = () => {
		if (handlePosition === 'default') {
			return 'default';
		}
		if (handlePosition === 'ml') {
			return 'ew-resize';
		}
		if (handlePosition === 'mt') {
			return 'ns-resize';
		}
		if (handlePosition === 'mr') {
			return 'ew-resize';
		}
		if (handlePosition === 'mb') {
			return 'ns-resize';
		}
		if (handlePosition === 'bl') {
			return 'nesw-resize';
		}
		if (handlePosition === 'br') {
			return 'nwse-resize';
		}
		if (handlePosition === 'tl') {
			return 'nwse-resize';
		}
		if (handlePosition === 'tr') {
			return 'nesw-resize';
		}
	};

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
	style="left: {x}px; top: {y}px; width: {size}px; height: 20px; cursor: {getCursor()}"
/>

<style>
	.handle {
		position: absolute;
		background-color: red;
	}
</style>
