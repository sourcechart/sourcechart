import { checkNameForSpacesandHyphens } from './FileUtils';

export class Query {
	// Builder Class for constructing DuckDB Queries. If you want to add a feature, add a new method and call it in new Query(queryObject).build
	queryObject: QueryObject;
	workFlow: WorkFlow;

	constructor(queryObject: QueryObject, workflow: WorkFlow) {
		this.queryObject = queryObject;
		this.workFlow = workflow;
	}

	public build() {
		if (this.workFlow === 'basic') {
			return this.getBasicQuery();
		} else if (this.workFlow === 'cluster') {
			return this.getClusterQuery();
		} else {
			return '';
		}
	}

	private checkClusterColumns() {
		let columns = this.queryObject.queries.select.cluster.attributes;
		for (let i = 0; i < columns.length; i++) {
			columns[i] = checkNameForSpacesandHyphens(columns[i]);
		}
		return columns;
	}

	private getClusterQuery() {
		let columns = this.checkClusterColumns();
		let filename: string = '';

		if (this.queryObject.queries.select.cluster.from) {
			var f = this.queryObject.queries.select.cluster.from;
			filename = checkNameForSpacesandHyphens(f);
		}

		let query = ['SELECT', columns.join(', '), 'FROM', filename].join(' ');
		return query;
	}

	private getBasicQuery() {
		let selectBlock = this.checkSelectBlock();
		let y = selectBlock.yColumn;
		let groupby = this.constructGroupBy();
		let aggregator = this.queryObject.queries.select.basic.yColumn.aggregator;
		let groupbyColumns = this.queryObject.queries.select.basic.groupbyColumns;

		if (aggregator && groupbyColumns)
			y = this.checkAggregator(y, aggregator, this.queryObject.queries.select.basic.groupbyColumns);

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
			xColumn = checkNameForSpacesandHyphens(selectBlock.select.basic.xColumn.column);
			yColumn = checkNameForSpacesandHyphens(selectBlock.select.basic.yColumn.column);
			file = checkNameForSpacesandHyphens(selectBlock.select.basic.from);
			return { xColumn: xColumn, yColumn: yColumn, file: file };
		} else {
			return { xColumn: null, yColumn: null, file: null };
		}
	}

	private constructGroupBy() {
		let groupbyQuery: string;
		let groupby: string[] = this.queryObject.queries.select.basic.groupbyColumns;
		let selectBlock = this.queryObject.queries.select.basic;

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
