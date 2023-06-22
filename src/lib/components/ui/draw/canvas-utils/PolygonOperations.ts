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

const calculateRectangleHandles = (polygon: Polygon): Point[] => {
	let handlePositions: Point[] = [...polygon.vertices];

	for (let i = 0; i < polygon.vertices.length; i++) {
		let nextIndex = (i + 1) % polygon.vertices.length; // Ensures that the last point connects to the first
		let midPoint: Point = {
			x: (polygon.vertices[i].x + polygon.vertices[nextIndex].x) / 2,
			y: (polygon.vertices[i].y + polygon.vertices[nextIndex].y) / 2
		};
		handlePositions.push(midPoint);
	}
	return handlePositions;
};

const createRectangleHandles = (polygon: Polygon, tolerance: number): any[] => {
	const handlePositions = calculateRectangleHandles(polygon);
	const cursorMappings = getRectangleHandles(polygon, handlePositions[0], tolerance);

	const rectangle: Rectangle = {
		x: Math.min(...handlePositions.map((point) => point.x)),
		y: Math.min(...handlePositions.map((point) => point.y)),
		width:
			Math.max(...handlePositions.map((point) => point.x)) -
			Math.min(...handlePositions.map((point) => point.x)),
		height:
			Math.max(...handlePositions.map((point) => point.y)) -
			Math.min(...handlePositions.map((point) => point.y))
	};

	const handles = [
		{
			position: () => ({ left: `${rectangle.x}px`, top: `${rectangle.y}px` }),
			cursor: cursorMappings
		}, // Top-left
		{
			position: () => ({ left: `${rectangle.x + rectangle.width / 2}px`, top: `${rectangle.y}px` }),
			cursor: cursorMappings
		}, // Top-middle
		{
			position: () => ({ left: `${rectangle.x + rectangle.width}px`, top: `${rectangle.y}px` }),
			cursor: cursorMappings
		}, // Top-right
		{
			position: () => ({
				left: `${rectangle.x + rectangle.width}px`,
				top: `${rectangle.y + rectangle.height / 2}px`
			}),
			cursor: cursorMappings
		}, // Middle-right
		{
			position: () => ({
				left: `${rectangle.x + rectangle.width}px`,
				top: `${rectangle.y + rectangle.height}px`
			}),
			cursor: cursorMappings
		}, // Bottom-right
		{
			position: () => ({
				left: `${rectangle.x + rectangle.width / 2}px`,
				top: `${rectangle.y + rectangle.height}px`
			}),
			cursor: cursorMappings
		}, // Bottom-middle
		{
			position: () => ({ left: `${rectangle.x}px`, top: `${rectangle.y + rectangle.height}px` }),
			cursor: cursorMappings
		}, // Bottom-left
		{
			position: () => ({
				left: `${rectangle.x}px`,
				top: `${rectangle.y + rectangle.height / 2}px`
			}),
			cursor: cursorMappings
		} // Middle-left
	];

	return handles;
};

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
			// handleRadius is the size of your handle
			scalingHandleIndex = i;
			mouseEventState.set('isScaling');
			break;
		}
	}
	return scalingHandleIndex;
};

/**
 * Get the handles for a rectangles
 *
 * @param polygon
 * @param point
 * @param tolerance
 * @returns
 */

const getRectangleHandles = (polygon: Polygon, point: Point, tolerance: number): string | null => {
	const handlePositions = calculateRectangleHandles(polygon);

	for (let i = 0; i < handlePositions.length; i++) {
		if (
			Math.abs(point.x - handlePositions[i].x) < tolerance &&
			Math.abs(point.y - handlePositions[i].y) < tolerance
		) {
			if (i < handlePositions.length) {
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
		}
	}

	return null;
};
export {
	getRectangleHandles,
	createRectangleHandles,
	calculateRectangleHandles,
	isPointInPolygon,
	getContainingPolygon,
	getScalingHandleIndex
};
