<script lang="ts">
	import { clickedChartIndex, allCharts, duckDBInstanceStore } from '$lib/io/Stores';
	import ArrowDown from '$lib/components/ui/icons/ArrowDown.svelte';
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
	class="selectFieldColor block w-full selectFieldColor text-left px-3 py-2 dark:text-black hover:bg-gray-200"
	on:click={exportToCSV}
>
	<div class="flex justify-between items-center w-full">
		<span>Export to CSV</span>
		<ArrowDown />
	</div>
</button>

<style>
	.selectFieldColor {
		background-color: #cd9f34;
	}

	.selectFieldColor:hover {
		background-color: #fccb59;
	}
</style>
