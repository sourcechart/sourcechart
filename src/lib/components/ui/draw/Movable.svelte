<script lang="ts">
	import { onMount } from 'svelte';
	import { navBarMode } from '$lib/io/stores';
	import { isPointInPolygon, getContainingPolygon } from './PointInPolygon';

	export let id: string = '';

	interface Point {
		x: number;
		y: number;
	}

	interface Polygon {
		vertices: Point[];
	}

	type Edge = 'top' | 'right' | 'bottom' | 'left';

	let width: number = 0;
	let height: number = 0;
	let tolerance = 10; // How close to the edge the user must start dragging
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let polygons: Polygon[] = [];
	let hoverStatus: boolean = false;
	let isDrawing: boolean = false;
	let selectedPolygonIndex: number | null = null;
	let isDragging: boolean = false;
	let resizeEdge: Edge | null = null;
	let isResizing: boolean = false;
	let start: Point = { x: 0, y: 0 };
	let dragOffset: Point = { x: 0, y: 0 };
	let currentMousePosition: Point = { x: 0, y: 0 };
	let cursorStyle: string;

	let editingTextIndex: number | null = null;
	let editingTextPosition: Point | null = null;
	let editText: string = '';

	$: mode = $navBarMode;
	$: cursorClass = hoverStatus ? cursorStyle : '';

	onMount(() => {
		context = canvas.getContext('2d');
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
				selectedPolygonIndex !== null
			) {
				polygons.splice(selectedPolygonIndex, 1);
				selectedPolygonIndex = null;
				redraw();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const redraw = (): void => {
		if (context) {
			context.clearRect(0, 0, width, height);
			polygons.forEach(drawRectangle);
			if (editingTextIndex !== null && editingTextPosition) {
				context.font = '16px Arial';
				context.fillText(editText, editingTextPosition.x, editingTextPosition.y);
			}
		}
	};

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
			context.lineWidth = 2; // Change this to your preferred line width
			handlePositions.forEach((point) => {
				if (context) {
					context.beginPath();
					context.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Change the 3rd argument to adjust the size of the circle
					context.stroke();
				}
			});
		}
	};

	const getEdgeHovered = (polygon: Polygon): Edge | null => {
		const { x, y } = currentMousePosition;

		if (Math.abs(y - polygon.vertices[0].y) < tolerance) {
			return 'top';
		} else if (Math.abs(x - polygon.vertices[1].x) < tolerance) {
			return 'right';
		} else if (Math.abs(y - polygon.vertices[2].y) < tolerance) {
			return 'bottom';
		} else if (Math.abs(x - polygon.vertices[3].x) < tolerance) {
			return 'left';
		}

		return null;
	};

	const updateHoverStatus = (): void => {
		hoverStatus = false;
		cursorStyle = '';
		for (let i = 0; i < polygons.length; i++) {
			const polygon = polygons[i];
			const edgeHovered = getEdgeHovered(polygon);
			if (edgeHovered) {
				hoverStatus = true;
				if (edgeHovered === 'top' || edgeHovered === 'bottom') {
					cursorStyle = 'ns-resize';
				} else if (edgeHovered === 'left' || edgeHovered === 'right') {
					cursorStyle = 'ew-resize';
				}
				break;
			} else if (isPointInPolygon(currentMousePosition, polygon)) {
				hoverStatus = true;
				cursorStyle = 'grabbable';
				break;
			}
		}
	};

	const drawRectangle = (polygon: Polygon, index: number): void => {
		if (context) {
			context.beginPath();
			polygon.vertices.forEach((point, idx) => {
				if (idx === 0) {
					if (context) context.moveTo(point.x, point.y);
				} else {
					if (context) context.lineTo(point.x, point.y);
				}
			});
			context.closePath();
			context.strokeStyle = selectedPolygonIndex === index ? 'red' : 'black';
			context.stroke();

			// If this is the selected polygon, draw the handles
			if (selectedPolygonIndex === index) {
				drawHandles(polygon);
			}
		}
	};

	const handleStart = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (mode === 'select' && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (polygon && isPointInPolygon({ x, y }, polygon)) {
				isDragging = true;
				dragOffset = { x, y };
				return;
			}
			if (polygon) {
				// Check if the user started dragging near an edge of the rectangle
				if (Math.abs(y - polygon.vertices[0].y) < tolerance) {
					isResizing = true;
					resizeEdge = 'top';
					return;
				} else if (Math.abs(x - polygon.vertices[1].x) < tolerance) {
					isResizing = true;
					resizeEdge = 'right';
					return;
				} else if (Math.abs(y - polygon.vertices[2].y) < tolerance) {
					isResizing = true;
					resizeEdge = 'bottom';
					return;
				} else if (Math.abs(x - polygon.vertices[3].x) < tolerance) {
					isResizing = true;
					resizeEdge = 'left';
					return;
				}
			}
		}
		if (mode === 'drawRectangle' && !isDrawing) {
			isDrawing = true;
			start = { x, y };
		}
	};

	const handleEnd = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (isDragging) {
			isDragging = false;
			return;
		}
		if (isResizing) {
			isResizing = false;
			resizeEdge = null;
			return;
		}
		if (isDrawing && start) {
			isDrawing = false;
			polygons.push({
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			});
			redraw();
		}
	};

	const handleMove = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		currentMousePosition = { x: x, y: y };
		updateHoverStatus();

		if (isDragging && selectedPolygonIndex !== null) {
			const dx = x - dragOffset.x;
			const dy = y - dragOffset.y;
			polygons[selectedPolygonIndex].vertices = polygons[selectedPolygonIndex].vertices.map(
				(vertex) => ({ x: vertex.x + dx, y: vertex.y + dy })
			);
			dragOffset = { x, y };
			redraw();
			return;
		}

		if (mode === 'eraser') {
			const point: Point = { x, y };
			const polygon = getContainingPolygon(point, polygons);
			const index = polygon ? polygons.indexOf(polygon) : -1;
			if (index > -1) {
				polygons.splice(index, 1);
				redraw();
			}
			return;
		}

		if (isResizing && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (resizeEdge === 'top') {
				polygon.vertices[0].y = y;
				polygon.vertices[1].y = y;
			} else if (resizeEdge === 'right') {
				polygon.vertices[1].x = x;
				polygon.vertices[2].x = x;
			} else if (resizeEdge === 'bottom') {
				polygon.vertices[2].y = y;
				polygon.vertices[3].y = y;
			} else if (resizeEdge === 'left') {
				polygon.vertices[3].x = x;
				polygon.vertices[0].x = x;
			}
			redraw();
			return;
		}

		if (isDrawing && context) {
			context.clearRect(0, 0, width, height); // Clear the canvas before drawing
			polygons.forEach(drawRectangle); // Draw all the completed rectangles
			drawRectangle(
				{
					vertices: [
						{ x: start.x, y: start.y },
						{ x: x, y: start.y },
						{ x: x, y: y },
						{ x: start.x, y: y }
					]
				},
				polygons.length
			); // Draw current rectangle
		}
	};

	const handleClick = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		const point: Point = { x, y };
		const polygon = getContainingPolygon(point, polygons);
		if (mode === 'textbox') {
			selectedPolygonIndex = polygon ? polygons.indexOf(polygon) : null;
			editingTextIndex = selectedPolygonIndex;
			editingTextPosition = polygon ? { x: polygon.vertices[0].x, y: polygon.vertices[0].y } : null;
		} else {
			selectedPolygonIndex = polygon ? polygons.indexOf(polygon) : null;
			editingTextIndex = null;
		}
		redraw();
	};
</script>

{#if editingTextIndex !== null && editingTextPosition}
	<input
		style="position: absolute; left: {editingTextPosition.x}px; top: {editingTextPosition.y}px"
		bind:value={editText}
		on:blur={() => (editingTextIndex = null)}
	/>
{/if}
<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>

<div {id}>
	<canvas
		class={cursorClass}
		{width}
		{height}
		bind:this={canvas}
		on:mousedown={handleStart}
		on:mouseup={handleEnd}
		on:mousemove={handleMove}
		on:click={handleClick}
	>
		<slot />
	</canvas>
</div>

<style>
	.grabbable,
	.ns-resize,
	.ew-resize {
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: -moz-grab;
		cursor: -webkit-grab;
	}

	.grabbable:active,
	.ns-resize:active,
	.ew-resize:active {
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

	.ns-resize {
		cursor: ns-resize;
	}

	.ew-resize {
		cursor: ew-resize;
	}
</style>
