<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import { onMount } from 'svelte';

	let width: number = 0;
	let height: number = 0;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	onMount(() => {
		context = canvas.getContext('2d')
		width = window.innerWidth;
		height = window.innerHeight;
	})


	const drawHandles = (polygon: Polygon) => {
		if (context) {
			// Create array to hold the positions of the handles
			let handlePositions: Point[] = [...polygon.vertices];

			// Calculate and add midway points between corners to the handlePositions
			for (let i = 0; i < polygon.vertices.length; i++) {
				let nextIndex = (i + 1) % polygon.vertices.length; // Ensures that the last point connects to the first
				let midPoint: Point = {
					x: (polygon.vertices[i].x + polygon.vertices[nextIndex].x) / 2,
					y: (polygon.vertices[i].y + polygon.vertices[nextIndex].y) / 2
				};
				handlePositions.push(midPoint);
			}

			// Draw the outline and circles
			context.strokeStyle = 'lime'; // Change this to your preferred color
			context.lineWidth = 1; // Change this to your preferred line width
			handlePositions.forEach((point) => {
				if (context) {
					context.beginPath();
					context.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Change the 3rd argument to adjust the size of the circle
					context.stroke();
				}
			});
		}
	};

	/*const redraw = (): void => {
		if (context) {
			context.clearRect(0, 0, width, height);
			polygons.forEach(drawRectangle);
			if (editingTextIndex !== null && editingTextPosition) {
				context.font = '16px Arial';
				context.fillText(editText, editingTextPosition.x, editingTextPosition.y);
			}
		}
	};
    */
</script>

<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
