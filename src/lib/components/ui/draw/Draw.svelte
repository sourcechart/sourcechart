<script lang="ts">
	import { Stage, Layer, Rect, Transformer } from 'svelte-konva';
	import { writable } from 'svelte/store';

	let width: number;
	let height: number;
	let fill: string = 'transparent';
	let stroke: string = 'black';

	type Rectangle = {
		x: number;
		y: number;
		width: number;
		height: number;
		fill: string;
		stroke: string;
		draggable: boolean;
	};

	let rectangles = writable<Rectangle[]>([]);
	let newRectangle: Rectangle[] = [];

	let transformer;
	let selectedShapeName = '';

	const handleMouseDown = (e: Event & { detail: { target: any } }) => {
		const konvaEvent = e.detail;

		console.log(konvaEvent.target.scaleX());
		const { x, y } = konvaEvent.target.getStage().getPointerPosition();
		newRectangle = [{ x, y, width: 0, height: 0, fill: fill, stroke: stroke, draggable: true }];
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
				stroke: stroke,
				draggable: true
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
					stroke: stroke,
					draggable: true
				}
			];
		}
	};

	const foo = () => {
		console.log('foo');
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
			<Rect config={rectangle} on:transform={foo} />
		{/each}
		{#each newRectangle as rectangle}
			<Rect config={rectangle} on:transform={foo} on:transformend={foo} />
		{/each}
		<Transformer bind:this={transformer} />
	</Layer>
</Stage>

<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
