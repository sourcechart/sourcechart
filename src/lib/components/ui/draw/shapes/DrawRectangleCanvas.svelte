<script lang="ts">
	import { onMount } from 'svelte';
	import { clearChartOptions, allCharts, mostRecentChartID, activeSidebar } from '$lib/io/Stores';
	import { redraw, drawRectangle, drawHandles, resizeRectangle } from '../canvas-utils/Draw';
	import { start } from '@popperjs/core';

	export let polygon: Polygon;

	let width: number;
	let height: number;
	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;
	let selectedPolygonIndex: number | null = null;
	let cursorClass: string | null = null;

	onMount(() => {
		context = canvas.getContext('2d');

		if (context) {
			let startX = polygon.vertices[0].x;
			let startY = polygon.vertices[0].y;
			let rectWidth = Math.abs(polygon.vertices[2].x - startX);
			let rectHeight = Math.abs(polygon.vertices[2].y - startY);
			context.strokeStyle = 'red';

			//context.beginPath();
			//polygon.vertices.forEach((point, idx) => {
			//	if (idx === 0) {
			//		if (context) context.moveTo(point.x, point.y);
			//	} else {
			//		if (context) context.lineTo(point.x, point.y);
			//	}
			//});
			console.log(startX, startY, rectWidth, rectHeight);
			context.strokeRect(10, startY, rectWidth, rectHeight);
			//context.rect(startX, startY, rectWidth, rectHeight);
			//context.closePath();
			//context.stroke();
			//console.log(startX, startY, rectHeight, rectWidth);
			//context.fillRect(startX, startY, rectWidth, rectHeight);
			//context.stroke();
		}
	});

	/**
	 * ### Remove Chart from the $allCharts stores
	 */
	const removeChart = () => {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 10);
		$allCharts = $allCharts.filter((item) => item.chartID !== $mostRecentChartID);
		$activeSidebar = false;
	};

	/*
	const handleMouseMove = (x: number, y: number): void => {
		x = x - offsetX;
		y = y - offsetY;
		currentMousePosition = { x: x, y: y };
		let hoverPolygon = null;
		const polygon = $polygons.find((polygon) => {
			let insidePolygon =
				PolyOps.isPointInPolygon(currentMousePosition, polygon) && $navBarState == 'select';
			hoverIntersection = insidePolygon ? true : false;
			if (insidePolygon) {
				hoverPolygon = polygon;
				handlePosition = PolyOps.getHandlesHovered(currentMousePosition, polygon, tolerance);
				cursorClass = getCursorStyleFromDirection(handlePosition);
				if (handlePosition) return true; // This will break the .find() loop
			}
			return false; // This will continue to the next item in the .find() loop
		});

		if (!polygon) {
			cursorClass = ''; // Reset the cursorClass if not found any polygon
		} else if (hoverPolygon && !cursorClass) {
			cursorClass = 'move'; // If we found a polygon but not hovering over any handles, set to 'move'
		} else {
			cursorClass = cursorClass || 'default'; // Change cursor back to default when not over handle
		}
	};
*/
	/**
	 * ### Remove chart from dashboard on BackSpace/Delete/Escape.
	 * @param e Keyboard event to delete items.
	 *
	const handleKeyDown = (e: KeyboardEvent) => {
		if (
			(e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Escape') &&
			selectedPolygonIndex !== null
		) {
			removeChart();
			$activeSidebar = false;
			$polygons.splice(selectedPolygonIndex, 1);
			if (selectedPolygonIndex > -1) {
				$polygons.splice(selectedPolygonIndex, 1);
			}
			if (context) redraw($polygons, context, width, height, selectedPolygonIndex);
			selectedPolygonIndex = null;
		}
	};
	 */

	/**
	 * ### Handle the resizing of a rectangle to different heights and widths
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
	const handleTouchResize = (xWithOffset: number, yWithOffset: number) => {
		if (selectedPolygonIndex !== null) {
			const polygon = $polygons[selectedPolygonIndex];
			if (handlePosition) resizeRectangle(xWithOffset, yWithOffset, polygon, handlePosition);
			if (context) {
				redraw(polygons, context, width, height, selectedPolygonIndex);
				drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
			}
		}
	};	 */

	/**
	 * ### Translate (Drag) the polygon element to a different position on the screen.
	 *
	 * @param xWithOffset x position on the screen
	 * @param yWithOffset y position on the screen
	 * @param context Canvas Rendering context
	 * @param selectedPolygonIndex the polygon we clicked on
	const handleTouchTranslate = (
		xWithOffset: number,
		yWithOffset: number,
		selectedPolygonIndex: number
	) => {
		const dx = xWithOffset - dragOffset.x;
		const dy = yWithOffset - dragOffset.y;
		const polygon = $polygons[selectedPolygonIndex];
		polygon.vertices = polygon.vertices.map((vertex) => ({
			x: vertex.x + dx,
			y: vertex.y + dy
		}));
		dragOffset = { x: xWithOffset, y: yWithOffset };

		//redraw(polygons, context, width, height, selectedPolygonIndex);
		//context.strokeStyle = HIGHLIGHTCOLOR;
		//drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
	};
	 */

	/**
	 * Handles the click functionality of the dashboard
	 *
	 * @param Mouse Event
	const handleClick = ({ offsetX: x, offsetY: y }: MouseEventExtended) => {
		let targetId: string | null = null;

		const point: Point = { x, y };
		const polygon = PolyOps.getContainingPolygon(point, $polygons);

		if (context && polygon) {
			selectedPolygonIndex = $polygons.indexOf(polygon);
			if (polygon.id) {
				targetId = polygon.id;
				mostRecentChartID.set(targetId);
			} // Here we get the target id
			redraw(polygons, context, width, height, selectedPolygonIndex);
			context.strokeStyle = HIGHLIGHTCOLOR;
			drawHandles(polygon, context, HIGHLIGHTCOLOR, handleRadius);
			$activeSidebar = true;

			if (!polygon && $navBarState === 'select') {
				selectedPolygonIndex = null;
				if (context) redraw(polygons, context, width, height, selectedPolygonIndex);
				activeSidebar.set(false);
			}

			return targetId;
		}
	};
		 */
</script>

<div id={polygon.id}>
	<canvas bind:this={canvas} {width} {height} />
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
