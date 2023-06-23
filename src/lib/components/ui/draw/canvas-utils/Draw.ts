import type { Polygon, Point, Rectangle } from './Types';
import { calculateRectangleHandles } from './PolygonOperations';

/**
 * Draw Rectangle edges.
 *
 * @param polygon
 * @param context
 * @param lineColor
 */
const drawRectangle = (
	polygon: Polygon,
	context: CanvasRenderingContext2D,
	lineColor: string
): void => {
	context.beginPath();
	polygon.vertices.forEach((point, idx) => {
		if (idx === 0) {
			if (context) context.moveTo(point.x, point.y);
		} else {
			if (context) context.lineTo(point.x, point.y);
		}
	});
	context.closePath();
	context.strokeStyle = lineColor;
	context.stroke();
};

/**
 * Redraw when you move the polygon
 *
 * @param polygons
 * @param context
 * @param width
 * @param height
 * @param selectedPolygonIndex
 */

const redraw = (
	polygons: Polygon[],
	context: CanvasRenderingContext2D,
	width: number,
	height: number,
	selectedPolygonIndex: number | null
): void => {
	context.clearRect(0, 0, width, height);
	polygons.forEach((polygon, i) => {
		let lineColor = i === selectedPolygonIndex ? 'red' : 'black';
		drawRectangle(polygon, context, lineColor);
	});
};

/**
 * Maybe I should delete this function later
 *
 * @param polygon
 * @param context
 * @param color
 * @param radius
 */
const drawHandles = (
	polygon: Polygon,
	context: CanvasRenderingContext2D,
	color: string,
	radius: number
) => {
	let handlePositions: Point[];
	handlePositions = calculateRectangleHandles(polygon);

	console.log(handlePositions);
	context.strokeStyle = color;
	context.lineWidth = 1;
	handlePositions.forEach((point) => {
		if (context) {
			context.beginPath();
			context.arc(point.x, point.y, 5, radius, 2 * Math.PI); // Change the 3rd argument to adjust the size of the circle
			context.stroke();
		}
	});
};

/**
 * Get the handles for a rectangles
 *
 * @param polygon
 * @param point
 * @param tolerance
 * @returns
 */
const getRectangleHandles = (polygon: Polygon): string | null => {
	const handlePositions = calculateRectangleHandles(polygon);

	for (let i = 0; i < handlePositions.length; i++) {
		// Change this based on the vertex (corner)
		switch (i) {
			case 0:
				return 'nwse-resize';
			case 1:
				return 'nesw-resize';
			case 2:
				return 'nwse-resize';
			case 3:
				return 'nesw-resize';
			case 4:
				return 'ns-resize';
			case 5:
				return 'ew-resize';
			case 6:
				return 'ns-resize';
			case 7:
				return 'ew-resize';
			default:
				return 'move'; // Fallback cursor
		}
	}
	return null;
};

const createRectangleHandles = (rectangle: Polygon) => {
	return rectangle.vertices.map((vertex, i) => {
		return {
			position: () => vertex,
			cursor:
				i % 2 === 0 ? (i === 0 ? 'nw-resize' : 'ne-resize') : i === 1 ? 'sw-resize' : 'se-resize'
		};
	});
};

export { drawRectangle, redraw, drawHandles, createRectangleHandles, getRectangleHandles };
