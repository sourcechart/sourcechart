import { mouseEventState } from '$lib/io/Stores';

/**
 * Checks is a point is in any created polygon or shape.
 *
 * @param point
 * @param polygon
 * @returns boolean
 */

function isPointInPolygon(point: Point, polygon: Polygon): boolean {
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
}

/**
 * Get the nearest surrounding polygon that a point that is in `x` and `y`.

 *  @param point the current point (mouse position, or other)
 *  @param polygons all the polygons that are on the canvas

*/
function getContainingPolygon(point: Point, polygons: Polygon[]): Polygon | null {
	let containedPolygon: Polygon | null = null;
	polygons.forEach((polygon) => {
		if (isPointInPolygon(point, polygon)) {
			if (!containedPolygon || polygon.vertices.length < containedPolygon.vertices.length) {
				containedPolygon = polygon;
			}
		}
	});
	return containedPolygon;
}

const calculateHandles = (polygon: Polygon): Point[] => {
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

const getHandles = (polygon: Polygon, point: Point, tolerance: number): string | null => {
	const handlePositions = calculateHandles(polygon);
	const verticesLength = polygon.vertices.length;

	for (let i = 0; i < handlePositions.length; i++) {
		if (
			Math.abs(point.x - handlePositions[i].x) < tolerance &&
			Math.abs(point.y - handlePositions[i].y) < tolerance
		) {
			if (i < verticesLength) {
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
					default:
						return 'move'; // Fallback cursor
				}
			} else {
				// Change this based on the midpoint (edge)
				const edgeIndex = i - verticesLength;
				switch (edgeIndex) {
					case 0:
						return 'ns-resize';
					case 1:
						return 'ew-resize';
					case 2:
						return 'ns-resize';
					case 3:
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
	getHandles,
	calculateHandles,
	isPointInPolygon,
	getContainingPolygon,
	getScalingHandleIndex
};
