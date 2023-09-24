<script lang="ts">
	import { clickedChartIndex, allCharts, duckDBInstanceStore } from '$lib/io/Stores';
	import { DataIO } from '$lib/io/DataIO';

	$: i = clickedChartIndex();
	$: chartConfig = $allCharts[$i];

	const exportToCSV = async () => {
		const db = $duckDBInstanceStore;
		const data = new DataIO(db, chartConfig);
		await data.queryExportCSV();
	};
</script>

<button
	class="selectFieldColor block selectFieldColor text-left px-3 py-2 dark:text-black hover:bg-gray-200"
	on:click={exportToCSV}
/>
