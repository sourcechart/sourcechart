import { mouseEventState } from '$lib/io/Stores';

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
 * Near Point
 *
 * @param currentMousePosition
 * @param handlePosition
 * @param name
 * @returns
 */
const nearPoint = (
	currentMousePosition: MouseEventExtended,
	handlePosition: Point,
	name: string
) => {
	return Math.abs(currentMousePosition.x - handlePosition.x) < 5 &&
		Math.abs(currentMousePosition.y - handlePosition.y) < 5
		? name
		: null;
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

const getHandles = () => {};

/**
 *If it is, switch to the "isScaling" state and store the index of the handle being dragged.
 *
 * @param handlePositions
 * @param currentMousePosition
 * @param handleRadius
 *
 * @returns index
 */
const getScalingHandleIndex = (
	handlePositions: Point[],
	currentMousePosition: MouseEventExtended | Point,
	handleRadius: number
): number | null => {
	let scalingHandleIndex: number | null = null; // Assign default value as null
	for (let i = 0; i < handlePositions.length; i++) {
		const dx = currentMousePosition.x - handlePositions[i].x;
		const dy = currentMousePosition.y - handlePositions[i].y;
		const distanceSquared = dx * dx + dy * dy;
		if (distanceSquared < handleRadius * handleRadius) {
			scalingHandleIndex = i;
			mouseEventState.set('isScaling');
			break;
		}
	}
	return scalingHandleIndex;
};

export {
	calculateRectangleHandles,
	nearPoint,
	isPointInPolygon,
	getContainingPolygon,
	getScalingHandleIndex
};
