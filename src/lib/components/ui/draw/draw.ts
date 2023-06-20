function drawRectangle(polygon: Polygon, context: CanvasRenderingContext2D): void {
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
}

function redraw(
	polygons: Polygon[],
	context: CanvasRenderingContext2D,
	width: number,
	height: number
): void {
	context.clearRect(0, 0, width, height);
	polygons.forEach((polygon) => {
		drawRectangle(polygon, context);
	});
}

export { drawRectangle, redraw };
