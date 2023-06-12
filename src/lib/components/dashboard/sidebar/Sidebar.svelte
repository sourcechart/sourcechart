<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		ClearChartOptions
	} from './sidebar-components';
	import {SidebarWrapper} from '$lib/components/common/ui';
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
>
	<SidebarWrapper bind:open={$activeChart} id="sidebar">
		<DatasetDropDown />
		<AxisDropDrown axis={'X'} />
		<AxisDropDrown axis={'Y'} />
		<Aggregator />
		<Groupby />
		<ClearChartOptions />
	</SidebarWrapper>
</div>
