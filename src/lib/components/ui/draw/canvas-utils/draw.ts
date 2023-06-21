import type { Polygon, Point } from './Types';
import { calculateHandles } from './Transform';

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

const drawHandles = (polygon: Polygon, context: CanvasRenderingContext2D, color: string) => {
	let handlePositions: Point[];
	handlePositions = calculateHandles(polygon);
	context.strokeStyle = color;
	context.lineWidth = 1;
	handlePositions.forEach((point) => {
		if (context) {
			context.beginPath();
			context.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Change the 3rd argument to adjust the size of the circle
			context.stroke();
		}
	});
};
export { drawRectangle, redraw, drawHandles };
