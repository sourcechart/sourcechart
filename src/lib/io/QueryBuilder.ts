enum WorkFlowType {
	Basic,
	Cluster
}
export class Query {
	// Builder Class for constructing DuckDB Queries. If you want to add a feature, add a new method and call it in new Query(queryObject).build
	queryObject: QueryObject;
	workFlow: WorkFlowType;

	constructor(queryObject: QueryObject, workflow: WorkFlowType) {
		this.queryObject = queryObject;
		this.workFlow = workflow;
	}

	public build() {
		switch (this.workFlow) {
			case WorkFlowType.Basic:
				return this.getBasicQuery();
			case WorkFlowType.Cluster:
				return this.getClusterQuery();
		}
	}

	private getClusterQuery() {}

	private getBasicQuery() {
		let selectBlock = this.checkSelectBlock();
		let y = selectBlock.yColumn;
		let groupby = this.constructGroupBy();
		let aggregator = this.queryObject.queries.select.basic.yColumn.aggregator;
		//@ts-ignore
		y = this.checkAggregator(y, aggregator, this.queryObject.queries.groupbyColumns);
		let selectQuery = this.constructSelect(selectBlock.xColumn, y, selectBlock.file);
		let queryParts = [selectQuery, groupby];
		let queryString = queryParts.join(' ');

		return queryString;
	}

	private checkSelectBlock() {
		let selectBlock: Queries = this.queryObject.queries;
		let xColumn: string;
		let yColumn: string;
		let file: string;
		if (
			selectBlock.select.basic.xColumn.column &&
			selectBlock.select.basic.yColumn.column &&
			selectBlock.select.basic.from
		) {
			xColumn = this.checkNameForSpacesandHyphens(selectBlock.select.basic.xColumn.column);
			yColumn = this.checkNameForSpacesandHyphens(selectBlock.select.basic.yColumn.column);
			file = this.checkNameForSpacesandHyphens(selectBlock.select.basic.from);
			return { xColumn: xColumn, yColumn: yColumn, file: file };
			//selectQuery = constructSelectBlock(xColumn, yColumn, file);
		} else {
			return { xColumn: null, yColumn: null, file: null };
		}
	}

	private constructGroupBy() {
		let groupbyQuery: string;
		//@ts-ignore
		let groupby: Array<string> = this.queryObject.queries.groupbyColumns; //@ts-ignore
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
