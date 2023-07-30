import type { DuckDBClient } from './DuckDBCLI';
import { Query } from '$lib/io/QueryBuilder';

enum WorkFlowType {
	Basic,
	Cluster
}

class ChartDataWorkFlow {
	private workflow: WorkFlowType;
	private db: DuckDBClient;
	private chart: Chart;

	constructor(db: DuckDBClient, workflow: WorkFlowType, chart: Chart) {
		this.workflow = workflow;
		this.db = db;
		this.chart = chart;
	}

	private getQueryObject(chart: Chart): QueryObject {
		return {
			chartID: chart?.chartID,
			queries: {
				select: {
					basic: {
						xColumn: { column: chart?.xColumn },
						yColumn: { column: chart?.yColumn, aggregator: chart?.aggregator },
						from: chart?.filename,
						groupbyColumns: [...(chart?.groupbyColumns ? chart.groupbyColumns : [])]
					},
					cluster: {
						attributes: [...(chart?.groupbyColumns ? chart.groupbyColumns : [])],
						from: chart.filename
					}
					/*on: { column1: null, column2: null, HOW: null }
                            filters: [
                                { column: null, filter: null },
                                { column: null, filter: null }
                            ],
                            having: [{ column: null, filter: null }],
                    */
				}
			}
		};
	}

	private query() {
		let queryObject = this.getQueryObject(this.chart);
		const query = new Query(queryObject, this.workflow);
		let queryString = query.build();
		return queryString;
	}

	public updateBasicChart(results: any[], chart: Chart) {
		var xColumn = this.getColumn(chart.xColumn);
		var yColumn = this.getColumn(chart.yColumn);
		var x = results.map((item) => item[xColumn]);
		var y = results.map((item) => item[yColumn]);
		chart.chartOptions.xAxis.data = x;
		chart.chartOptions.series[0].data = y;
		return chart;
	}

	private getColumn = (column: string | null) => {
		if (column) {
			return column.toString();
		} else {
			return '';
		}
	};

	public async updateChart() {
		let queryString = this.query();
		let results = await this.getDataResults(this.db, queryString);

		switch (this.workflow) {
			case WorkFlowType.Basic:
				return this.updateBasicChart(results, this.chart);
			case WorkFlowType.Cluster:
				return this.updateDensityChart(results, this.chart);
			default:
				break;
		}
	}

	private formatData(res: any) {
		const results = JSON.parse(
			JSON.stringify(
				res,
				(_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
			)
		);
		return results;
	}

	private async getDataResults(db: DuckDBClient, query: string) {
		var results = await db.query(query);
		return this.formatData(results);
	}

	private updateDensityChart(embedding: number[][], chart: Chart) {
		//@ts-ignore
		chart.chartOptions.xAxis = {}; //@ts-ignore
		chart.chartOptions.yAxis = {};
		chart.chartOptions.series[0] = {
			//@ts-ignore
			data: embedding,
			type: 'scatter',
			symbolSize: 10
		};

		return chart;
	}
}

export { ChartDataWorkFlow, WorkFlowType };
