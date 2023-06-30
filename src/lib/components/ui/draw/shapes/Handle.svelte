<script lang="ts">
	import { mouseEventState } from '$lib/io/Stores';

	export let position: Point = { x: 0, y: 0 };
	export let onDrag = (dx: number, dy: number) => {};

	let handle;

	const getEventPosition = (e: MouseEvent | TouchEvent) => {
		if (e instanceof TouchEvent) {
			return {
				movementX: e.touches[0].clientX - position.x,
				movementY: e.touches[0].clientY - position.y
			};
		} else {
			return { movementX: e.movementX, movementY: e.movementY };
		}
	};

	const handleMouseDown = (e: MouseEvent | TouchEvent) => {
		e.preventDefault();
		mouseEventState.set('isResizing');
	};

	const handleMouseMove = (e: MouseEvent | TouchEvent) => {
		if (e instanceof MouseEvent ? e.buttons === 1 : e.touches.length === 1) {
			const { movementX, movementY } = getEventPosition(e);
			onDrag(movementX, movementY);
		}
	};

	const handleMouseUp = (e: MouseEvent | TouchEvent) => {
		mouseEventState.set('isHovering');
	};
</script>

<div
	bind:this={handle}
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:touchstart={handleMouseDown}
	on:touchmove={handleMouseMove}
	on:touchend={handleMouseUp}
	style="position: absolute; left: {position.x}px; top: {position.y}px; width: 10px; height: 10px; background: black; cursor: pointer"
/>
