import Clustering from 'density-clustering';

let cluster = new Clustering.DBSCAN();
cluster.run(dataset, 0.5, 2);
