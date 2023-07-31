<script lang="ts">
	import { ColumnDropDrown, Aggregator, Groupby, ChartDropdown, Tags } from './sidebar-components';
	import { allCharts, mostRecentChartID } from '$lib/io/Stores';

	allCharts.update((chart) => {
		//@ts-ignore
		if (chart.chartID === $mostRecentChartID) chart.workflow = 'lowcode';
		return chart;
	});
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Chart</p>
		<ChartDropdown />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Axis</p>
		<ColumnDropDrown axis={'X'} />
		<ColumnDropDrown axis={'Y'} />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Aggregator</p>
		<Aggregator />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Groupby</p>
		<Groupby />
		<Tags />
	</div>
</div>
