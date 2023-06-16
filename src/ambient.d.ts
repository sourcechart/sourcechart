type Chart = {
	chartID: string;
	filename: string | null;
	aggregator: string | null;
	datasetID: string | null;
	columns: Array<string>;
	groupbyColumns: Array<string>;
	xColumn: string | null;
	yColumn: string | null;
	xData: Array<number>;
	yData: Array<number>;
	database: AsyncDuckDB;
	chartOptions: ChartOptions;
};

type ChartOptions = {
	xAxis: {
		data: Array<number>;
	};
	series: [
		{
			data: Array<number>;
			type: string;
		}
	];
};

type SelectBlock = {
	xColumn: { column: string|null|undefined };
	yColumn: { column: string|null|undefined; aggregator: string | null |undefined};
	from: string|undefined|null;
};

type Queries = {
	select: SelectBlock;
	//filters: Array<Condition>;
	//having: Array<Condition>;
	groupbyColumns: Array<string|null|undefined>|undefined;
};
type Condition = { column: string; filter: string | null | number };

type QueryObject = {
	chartID: string|null|unknown;
	queries: Queries;
};

type fileUpload = {
	filename: string;
	columns: Array<null | string>;
	size: number;
	datasetID: string;
	database: AsyncDuckDB;
};

type Field = {
	name?: string;
	type: any;
	nullable?: boolean;
	databaseType: string;
};

interface Point {
		x: number;
		y: number;
	}

interface Polygon {
		vertices: Point[];
	}

interface MouseEventExtended extends MouseEvent {
		offsetX: number;
		offsetY: number;
	}
