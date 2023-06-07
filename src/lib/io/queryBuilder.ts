

export class Query {
	// Builder Class for constructing DuckDB Queries. If you want to add a feature, add a new method and call it in new Query(queryObject).build
	queryObject: QueryObject;
	constructor(queryObject: QueryObject) {
		this.queryObject = queryObject;
	}

	public build() {
		let selectBlock = this.checkSelectBlock();
		let y = selectBlock.yColumn;
		let groupby = this.constructGroupBy();
		let aggregator = this.queryObject.queries.select.yColumn.aggregator;
		y = this.checkAggregator(y, aggregator, this.queryObject.queries.groupbyColumns);
		let selectQuery = this.constructSelect(selectBlock.xColumn, y, selectBlock.file);
		let queryParts = [selectQuery, groupby];
		let queryString = queryParts.join(' ');

		return queryString;
	}

	private checkSelectBlock() {
		let selectBlock: selectBlock = this.queryObject.queries.select;
		let xColumn: string;
		let yColumn: string;
		let file: string;
		if (selectBlock?.xColumn?.column && selectBlock?.yColumn?.column && selectBlock.from) {
			xColumn = this.checkNameForSpacesandHyphens(selectBlock.xColumn.column);
			yColumn = this.checkNameForSpacesandHyphens(selectBlock.yColumn.column);
			file = this.checkNameForSpacesandHyphens(selectBlock.from);
			return { xColumn: xColumn, yColumn: yColumn, file: file };
			//selectQuery = constructSelectBlock(xColumn, yColumn, file);
		} else {
			return { xColumn: null, yColumn: null, file: null };
		}
	}

	private constructGroupBy() {
		let groupbyQuery: string;
		let groupby: Array<string> = this.queryObject.queries.groupbyColumns;
		let selectBlock: selectBlock = this.queryObject.queries.select;

		if (selectBlock.xColumn.column && groupby.length > 0) {
			groupbyQuery = this.checkXColumnInGroupBy(groupby, selectBlock.xColumn.column);
			groupbyQuery = ['', 'GROUP BY', groupbyQuery].join(' ');
		} else {
			return '';
		}
		return groupbyQuery;
	}

	private checkXColumnInGroupBy(groupby: Array<string>, xColumn: string) {
		if (groupby.find((item) => item === xColumn)) {
			//If X column is in the group
			return groupby.join(', ');
		} else {
			return '';
		}
	}

	private checkAggregator(
		yColumn: string | null,
		aggregator: string | number | null,
		groupbyColumns: Array<string>
	): string | null {
		let column;
		if (groupbyColumns.length > 0) {
			//In the future, if there only needs to be one column for a visualization, we can adjust this.
			column = `${aggregator}(${yColumn}) AS ${yColumn}`;
			return column;
		}
		return yColumn;
	}

	private checkNameForSpacesandHyphens(column: string) {
		if (!column.match('^[a-zA-Z0-9]+$')) {
			column = ['"', column, '"'].join('');
		}
		return column;
	}

	private constructSelect(
		xColumn: string | null,
		yColumn: string | null,
		file: string | null
	): string {
		if (xColumn && yColumn && file) {
			return `SELECT ${xColumn}, ${yColumn} FROM ${file}`;
		} else {
			return '';
		}
	}
}
