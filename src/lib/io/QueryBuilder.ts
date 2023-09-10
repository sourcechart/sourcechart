import { checkNameForSpacesAndHyphens } from './FileUtils';

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
			columns[i] = checkNameForSpacesAndHyphens(columns[i]);
		}
		return columns;
	}

	private getClusterQuery() {
		let columns = this.checkClusterColumns();
		let filename: string = '';

		if (this.queryObject.queries.select.cluster.from) {
			var f = this.queryObject.queries.select.cluster.from;
			filename = checkNameForSpacesAndHyphens(f);
		}

		let query = ['SELECT', columns.join(', '), 'FROM', filename].join(' ');
		return query;
	}

	private getBasicQuery() {
		var selectBlock = this.checkSelectBlock();
		var y = selectBlock.yColumn;
		var groupby = this.constructGroupBy();
		var aggregator = this.queryObject.queries.select.basic.yColumn.aggregator;
		var groupbyColumns = this.queryObject.queries.select.basic.groupbyColumns;
		var filterColumns = this.queryObject.queries.select.basic.filterColumns;
		let filters = '';

		if (aggregator && groupbyColumns)
			y = this.checkAggregator(y, aggregator, this.queryObject.queries.select.basic.groupbyColumns);

		if (filterColumns.length > 0) {
			filters = this.constructFilters(filterColumns);
		}
		var selectQuery = this.constructSelect(selectBlock.xColumn, y, selectBlock.file);
		var queryParts = [selectQuery, groupby, filters];
		var queryString = queryParts.join(' ');
		console.log(queryString);
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
			xColumn = checkNameForSpacesAndHyphens(selectBlock.select.basic.xColumn.column);
			yColumn = checkNameForSpacesAndHyphens(selectBlock.select.basic.yColumn.column);
			file = checkNameForSpacesAndHyphens(selectBlock.select.basic.from);
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

	private constructFilters(conditions: any[]): string {
		const clauses = conditions.map((condition) => {
			if ('min' in condition.value && 'max' in condition.value) {
				return `${checkNameForSpacesAndHyphens(condition.column)} BETWEEN ${
					condition.value.min
				} AND ${condition.value.max}`;
			} else if ('item' in condition.value) {
				return `${checkNameForSpacesAndHyphens(condition.column)} = '${condition.value.item}'`;
			}
			return '';
		});

		const filteredClauses = clauses.filter(Boolean);
		if (filteredClauses.length === 0) {
			return ''; // Return an empty string if there are no valid conditions
		}
		return 'WHERE ' + filteredClauses.join(' AND ');
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
