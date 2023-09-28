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

	let showTooltip: boolean = false;
	let hoverTimeout: NodeJS.Timeout;

	const startHover = (): void => {
		hoverTimeout = setTimeout(() => {
			showTooltip = true;
		}, 800);
	};

	const endHover = (): void => {
		clearTimeout(hoverTimeout);
		showTooltip = false;
	};
</script>

<div class="relative inline-block">
	<button
		aria-label="Export to CSV"
		class="block selectFieldColor text-left py-2 dark:text-black w-full h-5"
		on:click={exportToCSV}
		on:mouseover={startHover}
		on:mouseout={endHover}
		on:focus={() => null}
		on:blur={() => null}
	/>
	<!-- Tooltip element -->
	{#if showTooltip}
		<div
			role="tooltip"
			class="absolute left-full top-1/2 transform -translate-y-1/2 p-2 bg-neutral-200 text-gray-700 text-xs rounded shadow-md"
		>
			Export to CSV
		</div>
	{/if}
</div>
