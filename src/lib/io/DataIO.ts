import type { DuckDBClient } from './DuckDBClient';
import { Query } from '$lib/io/QueryBuilder';
import { DBSCAN } from '$lib/analytics/dbscan/DBScan';
import dayjs from 'dayjs';

class DataIO {
	private db: DuckDBClient;
	private chart: Chart;
	private epsilon: number | undefined;
	private minPoints: number | undefined;

	constructor(db: DuckDBClient, chart: Chart, epsilon?: number, minPoints?: number) {
		this.db = db;
		this.chart = chart;
		this.epsilon = epsilon;
		this.minPoints = minPoints;
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
						groupbyColumns: [...(chart?.groupbyColumns ? chart.groupbyColumns : [])],
						filterColumns: [...(chart?.filterColumns ? chart.filterColumns : [])]
					},
					cluster: {
						attributes: [...(chart?.groupbyColumns ? chart.groupbyColumns : [])],
						from: chart.filename
					}
				}
			}
		};
	}

	private createChartTitle(queryObject: QueryObject): string {
		const basicQuery = queryObject.queries.select.basic;
		const titleParts = [];

		if (basicQuery.from) {
			titleParts.push(`Data from ${basicQuery.from}`);
		}

		if (basicQuery.yColumn.aggregator) {
			titleParts.push(`${basicQuery.yColumn.aggregator} of ${basicQuery.yColumn.column}`);
		} else {
			titleParts.push(basicQuery.yColumn.column);
		}

		if (basicQuery.xColumn.column) {
			titleParts.push(`vs ${basicQuery.xColumn.column}`);
		}

		if (basicQuery.groupbyColumns && basicQuery.groupbyColumns.length) {
			titleParts.push(`Grouped by ${basicQuery.groupbyColumns.join(', ')}`);
		}

		if (basicQuery.filterColumns && basicQuery.filterColumns.length) {
			titleParts.push(`Filtered by ${basicQuery.filterColumns.map((fc) => fc.column).join(', ')}`);
		}

		return titleParts.join(' - ');
	}

	private query() {
		const queryObject = this.getQueryObject(this.chart);
		const query = new Query(queryObject, this.chart.workflow);
		return query.build();
	}

	public async queryExportCSV() {
		const queryObject = this.getQueryObject(this.chart);
		const query = new Query(queryObject, this.chart.workflow);
		const queryString = query.getExportQuery();
		const data = await this.getMultiDimensionalData(queryString);
		this.downloadTSV(data, 'export.tsv');
	}

	private updateBasicChart(results: any[], chart: Chart) {
		const xColumn = this.getColumn(chart.xColumn);
		const yColumn = this.getColumn(chart.yColumn);
		let x = results.map((item) => item[xColumn]);
		const y = results.map((item) => item[yColumn]);

		const inferredFormat = this.inferDateFormat(x);
		if (typeof inferredFormat === 'string') {
			x = x.map((dateString) => dayjs(dateString).format(inferredFormat));
		}
		chart.chartOptions.xAxis.data = x;
		chart.chartOptions.series[0].data = y;
		return chart;
	}

	private getColumn(column: string | null): string {
		return column ? column.toString() : '';
	}

	private downloadTSV(data: any[], filename: string) {
		const tsv = this.dataToTSV(data);
		const blob = new Blob([tsv], { type: 'text/tsv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', filename);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	private dataToTSV(data: any[]): string {
		const header = Object.keys(data[0]).join('\t');
		const rows = data.map((row) => {
			return Object.values(row)
				.map((val) => {
					if (
						typeof val === 'string' &&
						(val.includes(',') || val.includes('\n') || val.includes('"'))
					) {
						return '"' + val.replace(/"/g, '""') + '"';
					}
					return val;
				})
				.join('\t');
		});

		return `${header}\n${rows.join('\n')}`;
	}

	public async updateChart() {
		const queryString = this.query();
		const results = await this.getDataResults(this.db, queryString);
		if (this.chart.workflow === 'basic') {
			return this.updateBasicChart(results, this.chart);
		} else if (this.chart.workflow === 'cluster' && this.chart.chartType === 'density') {
			// Handle logic for clustering and density
		} else if (this.chart.workflow === 'cluster' && this.chart.chartType) {
			const chartResults = this.getAudienceSegmentationResult(results);
			return this.updateAudienceSegmentationChart(chartResults, this.chart);
		}
	}

	private getDensityResults(results: any) {
		const multidimensialArray = results.map((obj: any) => Object.values(obj));
		if (this.epsilon && this.minPoints) {
			const dbscan = new DBSCAN(multidimensialArray, this.epsilon, this.minPoints, 'euclidean');
			const clusters = dbscan.run().getClusters();
			if (multidimensialArray.length > 1000) {
				// Handle larger datasets
				return;
			} else {
				// Handle smaller datasets
				return clusters;
			}
		} else {
			throw new Error('Epsilon and minPoints should be set for density analysis.');
		}
	}

	private getAudienceSegmentationResult(results: any): any[] {
		const multidimensialArray = results.map((obj: any) => Object.values(obj));
		// Logic to handle audience segmentation results
		return multidimensialArray;
	}

	private updateAudienceSegmentationChart(results: any[], chart: Chart) {
		// Logic to update chart based on audience segmentation results
		return chart;
	}

	public async getDataResults(db: DuckDBClient, queryString: string): Promise<any[]> {
		const results = await db.query(queryString);

		return results;
	}

	public async getMultiDimensionalData(queryString: string): Promise<any[]> {
		const results = await this.getDataResults(this.db, queryString);
		return results.map((row) => Object.values(row));
	}

	private inferDateFormat(dates: string[]): string | string[] {
		// Convert date strings to dayjs objects and check validity
		const dateObjects = dates.map((dateString) => dayjs(dateString, 'YYYY-MM-DD', true));

		// Check if all dates are valid
		const allValid = dateObjects.every((date) => date.isValid());

		if (!allValid) {
			return dates; // Return original strings if any date is invalid
		}

		// Find earliest and latest dates
		const minDate = dateObjects.reduce((a, b) => (a.isBefore(b) ? a : b));
		const maxDate = dateObjects.reduce((a, b) => (a.isAfter(b) ? a : b));

		// Calculate the range in various units
		const rangeInDays = maxDate.diff(minDate, 'day');
		const rangeInHours = maxDate.diff(minDate, 'hour');
		const rangeInMinutes = maxDate.diff(minDate, 'minute');
		const rangeInYears = maxDate.diff(minDate, 'year');

		// Decide format based on range
		if (rangeInMinutes < 60) {
			return 'HH:mm:ss'; // Hours, minutes, seconds
		} else if (rangeInHours < 24) {
			return 'HH:mm';
		} else if (rangeInDays < 30) {
			return 'MM-DD'; // Month-Day
		} else if (rangeInYears < 1) {
			return 'MM YYYY'; // Month abbreviation and Year
		} else {
			return 'YYYY'; // Just the year
		}
	}
}

export { DataIO };
