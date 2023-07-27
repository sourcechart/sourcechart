type DistanceFunction = (a: number[], b: number[]) => number;
import { gowerDistance } from '../metrics/DistanceMetrics';

export class DBSCAN {
	private dataset: number[][] = [];
	private epsilon: number = 1;
	private minPts: number = 2;
	private distance: DistanceFunction = gowerDistance;
	private clusters: number[][] = [];
	private noise: number[] = [];

	// Temporary variables used during computation
	private _visited: number[] = [];
	private _assigned: number[] = [];
	private _datasetLength: number = 0;

	constructor(
		dataset?: number[][],
		epsilon?: number,
		minPts?: number,
		distanceFunction?: DistanceFunction
	) {
		this.init(dataset, epsilon, minPts, distanceFunction);
	}

	// Public functions
	public run(): number[][] {
		for (let pointId = 0; pointId < this._datasetLength; pointId++) {
			if (this._visited[pointId] !== 1) {
				this._visited[pointId] = 1;

				const neighbors = this.regionQuery(pointId);

				if (neighbors.length < this.minPts) {
					this.noise.push(pointId);
				} else {
					const clusterId = this.clusters.length;
					this.clusters.push([]);
					this.addToCluster(pointId, clusterId);

					this.expandCluster(clusterId, neighbors);
				}
			}
		}

		return this.clusters;
	}

	public getLabels(): Record<number, number[][]> {
		const labels: Record<number, number[][]> = {};
		this.clusters.forEach((cluster, clusterId) => {
			labels[clusterId] = cluster.map((pointId) => this.dataset[pointId]);
		});
		return labels;
	}

	private init(
		dataset?: number[][],
		epsilon?: number,
		minPts?: number,
		distance?: DistanceFunction
	) {
		if (dataset) {
			if (!Array.isArray(dataset)) {
				throw new Error('Dataset must be of type array, ' + typeof dataset + ' given');
			}

			this.dataset = dataset;
			this.clusters = [];
			this.noise = [];

			this._datasetLength = dataset.length;
			this._visited = new Array(this._datasetLength);
			this._assigned = new Array(this._datasetLength);
		}

		if (epsilon) {
			this.epsilon = epsilon;
		}

		if (minPts) {
			this.minPts = minPts;
		}

		if (distance) {
			this.distance = distance;
		}
	}

	private expandCluster(clusterId: number, neighbors: number[]) {
		for (let i = 0; i < neighbors.length; i++) {
			const pointId2 = neighbors[i];

			if (this._visited[pointId2] !== 1) {
				this._visited[pointId2] = 1;
				const neighbors2 = this.regionQuery(pointId2);

				if (neighbors2.length >= this.minPts) {
					neighbors = this._mergeArrays(neighbors, neighbors2);
				}
			}

			if (this._assigned[pointId2] !== 1) {
				this.addToCluster(pointId2, clusterId);
			}
		}
	}

	private addToCluster(pointId: number, clusterId: number) {
		this.clusters[clusterId].push(pointId);
		this._assigned[pointId] = 1;
	}

	private regionQuery(pointId: number): number[] {
		const neighbors: number[] = [];

		for (let id = 0; id < this._datasetLength; id++) {
			const dist = this.distance(this.dataset[pointId], this.dataset[id]);
			if (dist < this.epsilon) {
				neighbors.push(id);
			}
		}

		return neighbors;
	}

	// Helpers
	private _mergeArrays(a: number[], b: number[]): number[] {
		return a.concat(b.filter((item) => a.indexOf(item) < 0));
	}
}
