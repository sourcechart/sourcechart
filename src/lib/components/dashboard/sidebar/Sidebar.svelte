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
		<div class="space-y-2">
			<div>
				<h3>Datasets</h3>
				<DatasetDropDown />
			</div>
			<div class="space-y-1">
				<h3>Axis Dropdown</h3>
				<AxisDropDrown axis={'X'} />
				<AxisDropDrown axis={'Y'} />
			</div>
			<div>
				<h3>Aggregate</h3>
				<Aggregator />
			</div>
			<div>
				<h3>GroupBy Columns</h3>
				<Groupby />
			</div>
			<div>
				<h3>Clear Chart</h3>
				<ClearChartOptions />
			</div>
		</div>
	</SidebarWrapper>
</div>
