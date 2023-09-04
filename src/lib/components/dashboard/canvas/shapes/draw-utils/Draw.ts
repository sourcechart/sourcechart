/**
 * Draw Rectangle edges.
 *
 * @param polygon
 * @param context
 * @param lineColor
 */
const drawRectangle = (
	vertices: Point[],
	context: CanvasRenderingContext2D,
	lineColor: string
): void => {
	context.beginPath();
	vertices.forEach((point, idx) => {
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
	windowWidth: number,
	windowHeight: number,
	selectedPolygonIndex: number | null
): void => {
	context.clearRect(0, 0, windowWidth, windowHeight);
	polygons.forEach((polygon, i) => {
		let lineColor = i === selectedPolygonIndex ? 'red' : 'black';
		drawRectangle(polygon.vertices, context, lineColor);
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
	vertices: Point[],
	context: CanvasRenderingContext2D,
	color: string,
	side: number
) => {
	context.strokeStyle = color;
	context.lineWidth = 1;
	vertices.forEach((point) => {
		context.globalAlpha = 0.5; // sets transparency to 50%
		context.beginPath();
		context.rect(point.x - side / 2, point.y - side / 2, side, side);
		context.stroke();
		context.globalAlpha = 1.0; // reset the transparency to the original state
	});
};
const drawEraserTrail = (
	mouseTrail: Point[],
	context: CanvasRenderingContext2D,
	windowWidth: number,
	windowHeight: number,
	lineColor: string
): void => {
	console.log(mouseTrail);
	if (mouseTrail.length < 2) return; // Need at least two points to draw a line

	context.strokeStyle = 'red';
	context.beginPath();
	context.moveTo(0, 0);

	for (let i = 0; i < mouseTrail.length; i++) {
		//console.log(mouseTrail[i].x, mouseTrail[i].y);

		context.lineTo(mouseTrail[i].x, mouseTrail[i].y);
		context.stroke();
	}
};

/**
 * Resize rectangle from corner
 *
 * @param x
 * @param y
 * @param polygon
 * @param resizeEdge
 */
const resizeRectangle = (x: number, y: number, polygon: Polygon, resizeEdge: string) => {
	//0:nw 1:ne 2:se 3:sw
	if (resizeEdge === 'n') {
		polygon.vertices[0].y = y;
		polygon.vertices[1].y = y;
	} else if (resizeEdge === 'e') {
		polygon.vertices[1].x = x;
		polygon.vertices[2].x = x;
	} else if (resizeEdge === 's') {
		polygon.vertices[2].y = y;
		polygon.vertices[3].y = y;
	} else if (resizeEdge === 'w') {
		polygon.vertices[3].x = x;
		polygon.vertices[0].x = x;
	} else if (resizeEdge === 'ne') {
		polygon.vertices[0].y = y;
		polygon.vertices[1].y = y;
		polygon.vertices[1].x = x;
		polygon.vertices[2].x = x;
	} else if (resizeEdge === 'se') {
		polygon.vertices[2].x = x;
		polygon.vertices[1].x = x;
		polygon.vertices[2].y = y;
		polygon.vertices[3].y = y;
	} else if (resizeEdge === 'sw') {
		polygon.vertices[3].x = x;
		polygon.vertices[0].x = x;
		polygon.vertices[2].y = y;
		polygon.vertices[3].y = y;
	} else if (resizeEdge === 'nw') {
		polygon.vertices[0].x = x;
		polygon.vertices[3].x = x;
		polygon.vertices[0].y = y;
		polygon.vertices[1].y = y;
	}
	return polygon;
};

const getPlotTopPosition = (polygon: Polygon) => {
	return Math.min(polygon.vertices[0].y, polygon.vertices[2].y);
};

const getPlotLeftPosition = (polygon: Polygon) => {
	return Math.abs(polygon.vertices[0].x - polygon.vertices[2].x);
};

export {
	drawRectangle,
	drawEraserTrail,
	redraw,
	drawHandles,
	resizeRectangle,
	getPlotTopPosition,
	getPlotLeftPosition
};
