import { calculateRectangleHandles, getRectangleHandles } from './PolygonOperations';

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
 * Draw HTML Files
 *
 * @param polygon
 * @param tolerance
 * @returns
 */

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
const createRectangleHandles = (polygon: Polygon): any[] => {
	const handlePositions = calculateRectangleHandles(polygon);
	const cursorMappings = getRectangleHandles(polygon);

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
export { drawRectangle, redraw, drawHandles, createRectangleHandles };
