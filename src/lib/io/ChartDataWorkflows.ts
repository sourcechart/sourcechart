import type { AsyncDuckDB } from '@duckdb/duckdb-wasm';

enum WorkFlowType {
	Basic,
	Cluster
}

class ChartDataWorkFlow {
	constructor(db?: AsyncDuckDB, workflow?: WorkFlowType) {}

	public getClusterWorkFlow() {}

	public getBasicDataResults() {}

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

	private updateChart(embedding: number[][], chart: Chart) {
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
