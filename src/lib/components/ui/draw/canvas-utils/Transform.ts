import { mouseEventState } from '$lib/io/Stores';

const calculateHandles = (polygon: Polygon) => {
	let handlePositions: Point[] = [...polygon.vertices];

	for (let i = 0; i < polygon.vertices.length; i++) {
		let nextIndex = (i + 1) % polygon.vertices.length; // Ensures that the lahighst point connects to the first
		let midPoint: Point = {
			x: (polygon.vertices[i].x + polygon.vertices[nextIndex].x) / 2,
			y: (polygon.vertices[i].y + polygon.vertices[nextIndex].y) / 2
		};
		handlePositions.push(midPoint);
	}
	return handlePositions;
};

const getScalingHandleIndex = (
	handlePositions: Point[],
	currentMousePosition: MouseEventExtended,
	handleRadius: number
) => {
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
export { calculateHandles, getScalingHandleIndex };
