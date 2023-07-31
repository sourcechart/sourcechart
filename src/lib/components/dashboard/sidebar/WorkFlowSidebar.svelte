<script lang="ts">
	import { ChooseIDColumn, Tags } from './sidebar-components';
	import { Groupby } from './sidebar-components';
	import { mostRecentChartID, allCharts } from '$lib/io/Stores';

	allCharts.update((chart) => {
		//@ts-ignore
		if (chart.chartID === $mostRecentChartID) chart.workflow = 'workflow';
		return chart;
	});
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<ChooseIDColumn />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Add Attributes</p>
		<Groupby />
		<Tags />
	</div>
</div>
