import { redraw } from './draw';
import type { Polygon } from './types';
/**
 * Translate (Drag) the polygon element to a different position on the screen.
 *
 * @param x x posistion on the screen
 * @param y y position on the screen
 * @param context 2d Canvas context
 * @param selectedPolygonIndex the polygon we clicked on
 */

const handleTouchTranslate = (
	x: number,
	y: number,
	context: CanvasRenderingContext2D,
	polygons: Polygon[],
	selectedPolygonIndex: number
) => {
	const dx = x - dragOffset.x;
	const dy = y - dragOffset.y;
	polygons[selectedPolygonIndex].vertices = polygons[selectedPolygonIndex].vertices.map(
		(vertex) => ({ x: vertex.x + dx, y: vertex.y + dy })
	);
	dragOffset = { x, y };
	redraw(polygons, context, width, height, selectedPolygonIndex);
};
