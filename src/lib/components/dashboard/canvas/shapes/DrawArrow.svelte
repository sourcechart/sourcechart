<script lang="ts">
	import { onMount } from 'svelte';
	import { canvasBehavior } from '$lib/io/Stores';
	import rough from 'roughjs/bin/rough';

	let canvas: HTMLCanvasElement;
	let roughCanvas: any;
	let startX: number = 0;
	let startY: number = 0;
	let endX: number = 0;
	let endY: number = 0;
	let width: number = 0;
	let height: number = 0;
	let arrows: { startX: number; startY: number; endX: number; endY: number }[] = [];

	$: CANVASBEHAVIOR = canvasBehavior();

	onMount(() => {
		roughCanvas = rough.canvas(canvas);
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
	});

	const drawAllArrows = (): void => {
		const context = canvas.getContext('2d');
		if (!context) return;

		// Clear canvas
		context.clearRect(0, 0, canvas.width, canvas.height);

		arrows.forEach((arrow) => {
			roughCanvas.line(arrow.startX, arrow.startY, arrow.endX, arrow.endY, {
				stroke: 'white',
				strokeWidth: 0.5,
				roughness: 0.4
			});

			const angle: number = Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX);
			const arrowLength: number = 10;
			const headX1: number = arrow.endX - arrowLength * Math.cos(angle + Math.PI / 6);
			const headY1: number = arrow.endY - arrowLength * Math.sin(angle + Math.PI / 6);
			const headX2: number = arrow.endX - arrowLength * Math.cos(angle - Math.PI / 6);
			const headY2: number = arrow.endY - arrowLength * Math.sin(angle - Math.PI / 6);

			const pathString: string = `M ${arrow.endX} ${arrow.endY} L ${headX1} ${headY1} L ${headX2} ${headY2} Z`;
			roughCanvas.path(pathString, {
				stroke: 'white',
				fill: 'white',
				strokeWidth: 0.5,
				roughness: 0.4
			});
		});
	};
	const handleStart = (e: MouseEvent | TouchEvent): void => {
		if (e instanceof TouchEvent && e.touches.length) {
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		} else if (e instanceof MouseEvent) {
			startX = e.clientX;
			startY = e.clientY;
			console.log(startX, startY);
		}
	};

	const drawArrow = (arrow: { startX: number; startY: number; endX: number; endY: number }) => {
		roughCanvas.line(arrow.startX, arrow.startY, arrow.endX, arrow.endY, {
			stroke: 'white',
			strokeWidth: 0.5,
			roughness: 0.4
		});

		const angle: number = Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX);
		const arrowLength: number = 10;
		const headX1: number = arrow.endX - arrowLength * Math.cos(angle + Math.PI / 6);
		const headY1: number = arrow.endY - arrowLength * Math.sin(angle + Math.PI / 6);
		const headX2: number = arrow.endX - arrowLength * Math.cos(angle - Math.PI / 6);
		const headY2: number = arrow.endY - arrowLength * Math.sin(angle - Math.PI / 6);

		const pathString: string = `M ${arrow.endX} ${arrow.endY} L ${headX1} ${headY1} L ${headX2} ${headY2} Z`;
		roughCanvas.path(pathString, {
			stroke: 'white',
			fill: 'white',
			strokeWidth: 0.5,
			roughness: 0.4
		});
	};

	const handleMove = (e: MouseEvent | TouchEvent): void => {
		if ($CANVASBEHAVIOR !== 'isDrawingArrow') return;

		if (e instanceof TouchEvent && e.touches.length) {
			endX = e.touches[0].clientX;
			endY = e.touches[0].clientY;
		} else if (e instanceof MouseEvent) {
			endX = e.clientX;
			endY = e.clientY;
		}

		// Clear the canvas and redraw saved arrows.
		const context = canvas.getContext('2d');
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		drawAllArrows();

		// Draw the current arrow
		drawArrow({ startX, startY, endX, endY });
	};

	const handleEnd = (): void => {
		if ($CANVASBEHAVIOR !== 'isDrawingArrow') return;

		arrows.push({ startX, startY, endX, endY });
		drawAllArrows();
	};
</script>

<div
	class="absolute h-full w-full"
	on:mousedown={handleStart}
	on:mouseup={handleEnd}
	on:mousemove={handleMove}
	on:touchstart={handleStart}
	on:touchmove={handleMove}
	on:touchend={handleEnd}
>
	<canvas style="position: absolute;" bind:this={canvas} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
			if (canvas) {
				canvas.width = width;
				canvas.height = height;
			}
		}
	}}
/>
