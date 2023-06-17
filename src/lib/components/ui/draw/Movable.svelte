<script lang="ts">
	import { onMount } from 'svelte';
	import { navBarMode } from '$lib/io/stores';
	import { isPointInPolygon, getContainingPolygon } from './PointInPolygon';

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
	let resizeCursor: string = '';

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
				const startPoint = polygon.vertices[0];
				dragOffset = { x: x - startPoint.x, y: y - startPoint.y };
				resizeCursor = 'grabbable';
				return;
			}
			// Check if the user started dragging near an edge of the rectangle
			if (polygon) {
				if (Math.abs(y - polygon.vertices[0].y) < tolerance) {
					isResizing = true;
					resizeEdge = 'top';
					resizeCursor = 'ns-resize';
					return;
				} else if (Math.abs(x - polygon.vertices[1].x) < tolerance) {
					isResizing = true;
					resizeEdge = 'right';
					resizeCursor = 'ew-resize';
					return;
				} else if (Math.abs(y - polygon.vertices[2].y) < tolerance) {
					isResizing = true;
					resizeEdge = 'bottom';
					resizeCursor = 'ns-resize';
					return;
				} else if (Math.abs(x - polygon.vertices[3].x) < tolerance) {
					isResizing = true;
					resizeEdge = 'left';
					resizeCursor = 'ew-resize';
					return;
				}
			}
		}
		if (mode === 'drawRectangle' && !isDrawing) {
			// 'drawRectangle' instead of 'draw'
			isDrawing = true;
			start = { x, y };
		}
	};

	const handleMove = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (isResizing && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (polygon && resizeEdge) {
				switch (resizeEdge) {
					case 'top':
						polygon.vertices[0].y = y;
						polygon.vertices[3].y = y;
						break;
					case 'right':
						polygon.vertices[1].x = x;
						polygon.vertices[2].x = x;
						break;
					case 'bottom':
						polygon.vertices[2].y = y;
						polygon.vertices[1].y = y;
						break;
					case 'left':
						polygon.vertices[0].x = x;
						polygon.vertices[3].x = x;
						break;
				}
				redraw();
			}
			return;
		}
		if (isDragging && selectedPolygonIndex !== null) {
			const polygon = polygons[selectedPolygonIndex];
			if (polygon) {
				const diffX = x - dragOffset.x - polygon.vertices[0].x;
				const diffY = y - dragOffset.y - polygon.vertices[0].y;
				polygon.vertices.forEach((vertex) => {
					vertex.x += diffX;
					vertex.y += diffY;
				});
				redraw();
			}
			return;
		}
		if (isDrawing) {
			redraw();
			if (context) {
				context.beginPath();
				//@ts-ignore
				context.rect(start.x, start.y, x - start.x, y - start.y);
				context.closePath();
				context.strokeStyle = 'black';
				context.stroke();
			}
		}
	};

	const handleEnd = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (isDrawing) {
			isDrawing = false;
			polygons.push({
				vertices: [
					{ x: start.x, y: start.y },
					{ x: x, y: start.y },
					{ x: x, y: y },
					{ x: start.x, y: y }
				]
			});
		} else if (mode === 'select') {
			// Add this condition
			const containedPolygon = getContainingPolygon({ x, y }, polygons);
			selectedPolygonIndex = containedPolygon ? polygons.indexOf(containedPolygon) : null;
			redraw();
		}
		if (isDragging) {
			isDragging = false;
		}
		if (isResizing) {
			isResizing = false;
		}
		resizeCursor = '';
	};

	const handleClick = ({ offsetX: x, offsetY: y }: MouseEvent) => {
		if (mode === 'select') {
			const containedPolygon = getContainingPolygon({ x, y }, polygons);
			selectedPolygonIndex = containedPolygon ? polygons.indexOf(containedPolygon) : null;
			redraw();
		}
	};
</script>

<svelte:window
	on:resize={() => {
		if (typeof window !== 'undefined') {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>

<div class={resizeCursor}>
	<canvas
		{width}
		{height}
		bind:this={canvas}
		on:mousedown={handleStart}
		on:mouseup={handleEnd}
		on:mousemove={handleMove}
		on:click={handleClick}
	/>
</div>
