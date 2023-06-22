export interface Polygon {
	id?: string;
	vertices: Point[];
}

export interface Point {
	x: number;
	y: number;
}

export type Rectangle = {
	x: number;
	y: number;
	width: number;
	height: number;
};
