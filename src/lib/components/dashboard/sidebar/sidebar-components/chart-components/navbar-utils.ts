import { allCharts, newChartID, activeChart, mostRecentChartID } from '$lib/io/stores';
import { generateID } from '$lib/io/fileUtils';
import { EChartBuilder } from '$lib/io/eChartBuilder';

export function addEChartPropsToStore(chart: string) {
    var echart = new EChartBuilder(chart);
    var eChartDataset = echart.getOptions();
    var id = generateID();
    newChartID.set(id);
    mostRecentChartID.set(id);
    var newChart = addMetadataToChart(eChartDataset, id, chart); //@ts-ignore
    allCharts.update((existingCharts) => [...existingCharts, newChart]);
    activeChart.set(true);
}

function addMetadataToChart(eChartDataset: object, id: string, chart: string) {
    let chartMetaData = {
        filename: null,
        chartID: id,
        datasetID: null,
        chartType: chart,
        colors: null,
        filters: [],
        groupbyColumns: [],
        aggregator: null,
        xColumn: null,
        yColumn: null,
        columns: [],
        chartOptions: eChartDataset
    };
    return chartMetaData;
}