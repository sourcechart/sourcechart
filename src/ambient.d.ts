/****************************
 *                          *
 *     SOURCECHART TYPES    *
 *                          *
 *****************************/

type WorkFlow = 'basic' | 'cluster';
type ChartType = 'Scatter' | 'Bar' | 'Line' | 'Pie' | 'Area' | 'ClusterDensity';
type DropdownType =
	| 'chartType'
	| 'aggregator'
	| 'dataset'
	| 'column'
	| 'groupby'
	| 'legend'
	| 'filter'
	| 'x'
	| 'y'
	| 'workflow'
	| 'source'
	| 'target'
	| 'weight'
	| 'fromLatitude'
	| 'toLatitude'
	| 'fromLongitude'
	| 'toLongitude'
	| 'from'
	| 'to'
	| 'polygon'
	| 'startPoint'
	| 'endPoint'
	| 'H3'
	| 'count';

type DistanceFunction = (a: number[], b: number[]) => number;
type PointVector = number[];

type arrow = {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	midX: number;
	midY: number;
};

type Chart = {
	title: string;
	chartType: string | null;
	chartID: string;
	workflow: WorkFlow;
	filename: string | null;
	aggregator: string | null;
	datasetID: string | null;
	columns: Array<string>;
	groupbyColumns: Array<string>;
	schema: any;
	legendKey: string | null;
	legendValues: string[] | number[];
	filterColumns: Array<any>;
	xColumn: string | null;
	yColumn: string | null;
	chartOptions: any;
	layers?: LayerOptions[];
};

type LayerOptions = {
	id: string;
	type:
		| ArcLayer
		| LineLayer
		| ScatterplotLayer
		| PathLayer
		| PolygonLayer
		| GeoJsonLayer
		| H3HexagonLayer;

	columns: string[];
};

type ArcLayer = {
	id: string;
	layerType: 'Arc';
	fromLatitudeColumn: string;
	fromLongitudeColumn: string;
	toLatitudeColumn: string;
	toLongitudeColumn: string;
	color: string;
	width: number;
	pickable: boolean;
};

type LineLayer = {
	id: string;
	layerType: 'Line';
	fromLatitude: string;
	fromLongitude: string;
	toLatitude: string;
	toLongitude: string;
	pickable: boolean;
	color: string;
};

type ScatterplotLayer = {
	id: string;
	type: 'Scatterplot';
	pickable: boolean;
	fillColor: string;
	radius: number;
	strokeColor: string;
	lineColor: string;
	opacity: number;
	columns: string[];
};

type PathLayer = {
	id: string;
	type: 'Path';
	columns: string[];
};

type PolygonLayer = {
	id: string;
	type: 'Polygon';
	columns: string[];
};

type GeoJsonLayer = {
	id: string;
	type: 'GeoJson';
	columns: string[];
};

type H3HexagonLayer = {
	id: string;
	wireframe: boolean;
	fillColor: number[];
	elevationScale: number;
	extruded: boolean;
	filled: boolean;
	pickable: boolean;
	hexColumn: string;
	countColumn: string;
	type: 'H3HexagonLayer';
};

type Canvas = {
	canvasWidth: number;
	canvasHeight: number;
	polygon: Polygon;
};

type ColumnName = {
	name: string;
	axis: string;
	chartID: string;
};

type ExternalDataset = {
	name: string;
	url: string;
	description: string;
};

type ChartOptions = {
	xAxis: {
		data: number[];
		type: string;
	};
	series: [
		{
			data: Array<number>;
			type: string;
		}
	];
	yAxis: {
		type: string;
	};
};

type Queries = {
	select: {
		basic: {
			xColumn: { column: string | null | undefined };
			yColumn: { column: string | null | undefined; aggregator: string | null | undefined };
			from: string | undefined | null;
			groupbyColumns: string[];
			filterColumns: any[];
			legendKey: string | null;
		};
		cluster: {
			attributes: string[];
			from: string | undefined | null;
		};
	};
};

type Condition = { column: string; filter: string | null | number };

type QueryObject = {
	chartID: string | null | unknown;
	queries: Queries;
};

type DataObject = {
	buffer: ArrayBuffer;
	filename: string;
};

type FileHandle = any; // You can use a more specific type if you have a type definition for file handles

type FileUpload = {
	filename: string;
	externalDataset: ExternalDataset | null;
	//fileHandle: FileHandle | null;
	datasetID: string;
	fileExtension: string | undefined;
	size: number | null;
};

type Field = {
	name?: string;
	type: any;
	nullable?: boolean;
	databaseType: string;
};

/****************************
 *                          *
 *       Canvas Types       *
 *                          *
 ***************************/

/**
 *  DEFINITIONS
 *  @param isTranslating when you are moving a rectangle to a different position withough changing the dimensions
 *  @param isResizing when you change the width, height or radius, of a polygon that already exists by manipulating and edge
 *  @param isHovering default state of the mouse where you can move it but it is not clicked
 *  @param isTouching when you are move your mouse and it is clicked
 */

type TouchState =
	| 'isHovering'
	| 'isTouching'
	| 'isTranslating'
	| 'isResizing'
	| 'isDrawing'
	| 'isErasing'
	| 'isDrawingArrow'
	| 'isPanning';
type HandlePosition = 'n' | 's' | 'w' | 'e' | 'ne' | 'nw' | 'sw' | 'se' | 'center';
type NavBar =
	| 'eraser'
	| 'select'
	| 'pan'
	| 'drawRectangle'
	| 'drawCircle'
	| 'drawArrow'
	| 'textbox';

type MobileBar = 'sidebar' | 'trash';

interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	stroke: string;
	id?: string;
	draggable: boolean;
}

type Point = {
	x: number;
	y: number;
};

type Arrow = {
	startX: number;
	startY: number;
	endX: number;
	endY: number;
	midX: number;
	midY: number;
};

interface Polygon {
	id?: string;
	vertices: Point[];
	isSelected?: boolean;
}

type LookupTable = {
	[key: string]: Point;
};
interface MouseEventExtended extends MouseEvent {
	offsetX: number;
	offsetY: number;
}

interface Shapes {
	Polygon: Polygon;
	Rectangle: Rectangle;
	Arrow: Arrow;
}

declare module '@deck.gl/core';
declare module '@deck.gl/layers';
declare module '@deck.gl/geo-layers';
