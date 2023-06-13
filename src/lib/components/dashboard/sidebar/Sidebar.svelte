<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		ClearChartOptions
	} from './sidebar-components';
	import { SidebarWrapper } from '$lib/components/ui';
	import { clickOutside, clickInside } from '$lib/actions/clickUtils';
	import { activeChart } from '$lib/io/stores';

	function handleInside() {
		$activeChart = true;
	}

	function handleOutside() {
		$activeChart = false;
	}
</script>

<div
	use:clickInside
	on:click_inside={handleInside}
	use:clickOutside
	on:click_outside={handleOutside}
	class="space-y-4"
>
	<SidebarWrapper bind:open={$activeChart} id="sidebar">
		<div class="space-y-3">
			<div class="text-xs space-y-1">
				<p>Datasets</p>
				<DatasetDropDown />
				<p>Axis Dropdown</p>
				<AxisDropDrown axis={'X'} />
				<AxisDropDrown axis={'Y'} />

				<p>Aggregate</p>
				<Aggregator />
				<p>GroupBy Columns</p>
				<Groupby />
				<p>Clear Chart</p>
				<ClearChartOptions />
			</div>
		</div>
	</SidebarWrapper>
</div>
