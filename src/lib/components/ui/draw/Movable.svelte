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
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let isDrawing: boolean = false;
	let start: Point = { x: 0, y: 0 };
	let polygons: Polygon[] = [];
	let selectedPolygonIndex: number | null = null;
	let isDragging: boolean = false;
	let dragOffset: Point = { x: 0, y: 0 };
	let tolerance = 200; // How close to the edge the user must start dragging
	let resizeEdge: Edge | null = null;
	let isResizing: boolean = false;
	let currentMousePosition: Point = { x: 0, y: 0 };
	let hoverStatus: boolean = false;

	$: mode = $navBarMode;

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
			polygons.forEach(drawPolygon);
		}
	};

	const drawPolygon = (polygon: Polygon, index: number): void => {
		if (context) {
			context.beginPath();
			polygon.vertices.forEach((point, idx) => {
				if (idx === 0) {
					//@ts-ignore
					context.moveTo(point.x, point.y);
				} else {
					//@ts-ignore
					context.lineTo(point.x, point.y);
				}
			});
			context.closePath();
			context.strokeStyle = selectedPolygonIndex === index ? 'red' : 'black';
			context.stroke();
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

	const updateHoverStatus = (): void => {
		hoverStatus = polygons.some((polygon) => {
			// Assuming rectangle vertices are ordered: top-left, top-right, bottom-right, bottom-left
			let topLeft = polygon.vertices[0];
			let bottomRight = polygon.vertices[2];
			return (
				currentMousePosition.x >= topLeft.x &&
				currentMousePosition.x <= bottomRight.x &&
				currentMousePosition.y >= topLeft.y &&
				currentMousePosition.y <= bottomRight.y
			);
		});
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
			polygons.forEach(drawPolygon); // Draw all the completed rectangles
			drawPolygon(
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
		selectedPolygonIndex = polygon ? polygons.indexOf(polygon) : null;
		redraw();
	};
	$: cursorClass = hoverStatus ? 'grabbable' : '';
	$: console.log(hoverStatus);
</script>

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
	/>
</div>

<style>
	.grabbable {
		cursor: move; /* fallback if grab cursor is unsupported */
		cursor: grab;
		cursor: -moz-grab;
		cursor: -webkit-grab;
	}

	.grabbable:active {
		cursor: grabbing;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

	.grabbable.ns-resize {
		cursor: ns-resize;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}
	.grabbable.ew-resize {
		cursor: ew-resize;
		cursor: -moz-grabbing;
		cursor: -webkit-grabbing;
	}

	.grabbable.nesw-resize {
		cursor: nesw-resize;
		cursor: -webkit-grabbing;
		cursor: -moz-grabbing;
	}

	.grabbable.nwse-resize {
		cursor: nwse-resize;
		cursor: -webkit-grabbing;
		cursor: -moz-grabbing;
	}
</style>
