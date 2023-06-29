import type { Point, Polygon } from './Types';

/**
 * Checks is a point is in any created polygon or shape.
 *
 * @param point
 * @param polygon
 * @returns boolean
 */
const isPointInPolygon = (point: Point, polygon: Polygon): boolean => {
	const x = point.x;
	const y = point.y;
	let inside = false;
	for (let i = 0, j = polygon.vertices.length - 1; i < polygon.vertices.length; j = i++) {
		const xi = polygon.vertices[i].x;
		const yi = polygon.vertices[i].y;
		const xj = polygon.vertices[j].x;
		const yj = polygon.vertices[j].y;

		const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) {
			inside = !inside;
		}
	}
	return inside;
};

/**
 * Get the nearest surrounding polygon that a point that is in `x` and `y`.

 *  @param point the current point (mouse position, or other)
 *  @param polygons all the polygons that are on the canvas

*/
const getContainingPolygon = (point: Point, polygons: Polygon[]): Polygon | null => {
	let containedPolygon: Polygon | null = null;
	polygons.forEach((polygon) => {
		if (isPointInPolygon(point, polygon)) {
			if (!containedPolygon || polygon.vertices.length < containedPolygon.vertices.length) {
				containedPolygon = polygon;
			}
		}
	});
	return containedPolygon;
};

/**
 * Create the dynamamic rectangles.
 *
 * @param polygon
 * @returns
 */
const calculateRectangleHandles = (polygon: Polygon): Point[] => {
	const { vertices } = polygon;
	let midPoints: Point[] = [];

	// Calculate midpoints if you want to resize on sides of rectangle too.
	for (let i = 0; i < vertices.length; i++) {
		let nextIndex = (i + 1) % vertices.length;
		midPoints.push({
			x: (vertices[i].x + vertices[nextIndex].x) / 2,
			y: (vertices[i].y + vertices[nextIndex].y) / 2
		});
	}

	// Concatenating vertices and midpoints to get all the handles.
	return vertices.concat(midPoints);
};

/**
 * ### Get the cursor for this position
 *
 * @param currentMousePosition
 * @param polygon
 * @param tolerance
 * @returns
 */
const getHandlesHovered = (
	currentMousePosition: Point,
	polygon: Polygon,
	tolerance: number
): HandlePosition => {
	const { x, y } = currentMousePosition;
	let handles = calculateRectangleHandles(polygon);

	for (let i = 0; i < handles.length; i++) {
		let dx = x - handles[i].x;
		let dy = y - handles[i].y;
		if (Math.sqrt(dx * dx + dy * dy) < tolerance) {
			switch (i) {
				case 0:
					return 'nw'; // top left
				case 1:
					return 'ne'; // top right
				case 2:
					return 'se'; // bottom right
				case 3:
					return 'sw'; // bottom left
				case 4:
					return 'n'; // middle top
				case 5:
					return 'e'; // middle right
				case 6:
					return 's'; // middle bottom
				case 7:
					return 'w'; // middle left
				default:
					return 'center';
			}
		}
	}
	return 'center'; // No handle is being hovered over.
};

export { calculateRectangleHandles, getHandlesHovered, isPointInPolygon, getContainingPolygon };
