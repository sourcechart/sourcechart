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

type selectBlock = {
	xColumn: { column: string };
	yColumn: { column: string; aggregator: string | null };
	from: string;
};

type queries = {
	select: selectBlock;
	filters: Array<condition>;
	having: Array<condition>;
	groupbyColumns: Array<string>;
};
type condition = { column: string; filter: string | null | number };

type QueryObject = {
	chartID: string;
	queries: queries;
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
