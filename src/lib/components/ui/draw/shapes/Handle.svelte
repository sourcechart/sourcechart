<!-- Handle.svelte -->
<script lang="ts">
	import { mouseEventState } from '$lib/io/Stores';

	export let position: Point = { x: 0, y: 0 };
	export let onDrag = (dx: number, dy: number) => {};

	let handle;

	const handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		mouseEventState.set('isResizing');
		//e.target.setPointerCapture(e.pointerId);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (e.buttons === 1) {
			onDrag(e.movementX, e.movementY);
		}
	};

	const handleMouseUp = (e: MouseEvent) => {
		mouseEventState.set('isHovering');
		//e.target.releasePointerCapture(e.pointerId);
	};
</script>

<div
	bind:this={handle}
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	style="position: absolute; left: {position.x}px; top: {position.y}px; width: 10px; height: 10px; background: black; cursor: pointer"
/>
