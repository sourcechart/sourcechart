import type { Polygon, Point } from './types';
const drawRectangle = (polygon: Polygon, context: CanvasRenderingContext2D): void => {
	context.beginPath();
	polygon.vertices.forEach((point, idx) => {
		if (idx === 0) {
			if (context) context.moveTo(point.x, point.y);
		} else {
			if (context) context.lineTo(point.x, point.y);
		}
	});
	context.closePath();
	context.strokeStyle = 'black';
	context.stroke();
};

const redraw = (
	polygons: Polygon[],
	context: CanvasRenderingContext2D,
	width: number,
	height: number
): void => {
	context.clearRect(0, 0, width, height);
	polygons.forEach((polygon) => {
		drawRectangle(polygon, context);
	});
};

const drawHandles = (polygon: Polygon, context: CanvasRenderingContext2D) => {
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
	context.lineWidth = 1; // Change this to your preferred line width
	handlePositions.forEach((point) => {
		if (context) {
			context.beginPath();
			context.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Change the 3rd argument to adjust the size of the circle
			context.stroke();
		}
	});
};

export { drawRectangle, redraw, drawHandles };
