<script lang="ts">
	import { touchStates } from '$lib/io/Stores';
	import { onMount } from 'svelte';
	import { drawEraserTrail } from '../draw-utils/Draw';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let width: number = 0;
	let height: number = 0;
	let eraserTrail: Point[] = [];
	let touchState = touchStates();
	let offsetX: number = 0;
	let offsetY: number = 0;
	const MAX_TRAIL_LENGTH = 5;

	onMount(() => {
		context = canvas.getContext('2d');
		width = window.innerWidth;
		height = window.innerHeight;
		updateOffset();
		canvas.width = width;
		canvas.height = height;
	});

	const updateOffset = () => {
		const rect = canvas.getBoundingClientRect();
		offsetX = rect.left;
		offsetY = Math.abs(rect.top - height);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if ($touchState !== 'isErasing') return;

		eraserTrail = [...eraserTrail, { x: e.clientX, y: e.clientY }];

		// If the trail length exceeds the max length, remove the oldest point
		while (eraserTrail.length > MAX_TRAIL_LENGTH) {
			eraserTrail.shift();
		}

		if (context) {
			// Clear the canvas
			context.clearRect(0, 0, width, height);
			// Draw the reduced trail on the cleared canvas
			drawEraserTrail(eraserTrail, context, '#433f3f50', 4);
		}
	};

	const handleMouseUp = () => {
		if ($touchState !== 'isErasing') return;
		if (context) {
			eraserTrail = [];
			context.clearRect(0, 0, width, height);
		}
	};
</script>

<svg use:action />
