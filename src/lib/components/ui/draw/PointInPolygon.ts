// checks if point is inside a polygon
export function isPointInPolygon(point: Point, polygon: Polygon): boolean {
    const x = point.x;
    const y = point.y;
    let inside = false;
    for (let i = 0, j = polygon.vertices.length - 1; i < polygon.vertices.length; j = i++) {
        const xi = polygon.vertices[i].x;
        const yi = polygon.vertices[i].y;
        const xj = polygon.vertices[j].x;
        const yj = polygon.vertices[j].y;

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}

// get the polygon which the point is inside, if any
export function getContainingPolygon(point: Point, polygons: Polygon[]): Polygon | null {
    let containedPolygon: Polygon | null = null;
    polygons.forEach(polygon => {
        if (isPointInPolygon(point, polygon)) {
            if (!containedPolygon || polygon.vertices.length < containedPolygon.vertices.length) {
                containedPolygon = polygon;
            }
        }
    });
    return containedPolygon;
}
