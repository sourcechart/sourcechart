<script lang="ts">
	import { Stage, Layer, Rect } from 'svelte-konva';
	import { writable } from 'svelte/store';

	let width: number;
	let height: number;
	let fill: string = 'transparent';
	let stroke: string = 'black';

	let rectangles = writable<Rectangle[]>([]);
	let newRectangle: Rectangle[] = [];

	const handleMouseDown = (e: Event & { detail: { target: any } }) => {
		if (newRectangle.length === 0) {
			const { x, y } = e.detail.target.getStage().getPointerPosition();
			newRectangle = [{ x, y, width: 0, height: 0, fill: fill, stroke: stroke }];
		}
	};

	const handleMouseUp = (e: Event & { detail: { target: any } }) => {
		if (newRectangle.length === 1) {
			const sx = newRectangle[0].x;
			const sy = newRectangle[0].y;
			const { x, y } = e.detail.target.getStage().getPointerPosition();

			const rectangleToAdd: Rectangle = {
				x: sx,
				y: sy,
				width: x - sx,
				height: y - sy,
				fill: fill,
				stroke: stroke
			};

			rectangles.update((oldRectangles) => [...oldRectangles, rectangleToAdd]);
			newRectangle = [];
		}
	};

	const handleMouseMove = (e: Event & { detail: { target: any } }) => {
		if (newRectangle.length === 1) {
			const sx = newRectangle[0].x;
			const sy = newRectangle[0].y;
			const { x, y } = e.detail.target.getStage().getPointerPosition();

			newRectangle = [
				{
					x: sx,
					y: sy,
					width: x - sx,
					height: y - sy,
					fill: fill,
					stroke: stroke
				}
			];
		}
	};
</script>

<Stage
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
	on:mousemove={handleMouseMove}
	config={{ width: width, height: height }}
>
	<Layer>
		{#each $rectangles as rectangle}
			<Rect config={rectangle} />
		{/each}
		{#each newRectangle as rectangle}
			<Rect config={rectangle} />
		{/each}
	</Layer>
</Stage>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
