<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		ClearChartOptions
	} from './sidebar-components';
	import { SidebarWrapper } from '$lib/components/ui';
	import { clickInside } from '$lib/actions/clickUtils';
	import { activeSidebar } from '$lib/io/stores';

	function handleInside() {
		$activeSidebar = true;
	}
</script>

<div
	use:clickInside={{}}
	on:click_inside={handleInside}
	use:clickOutside={{}}
	on:click_outside={handleOutside}
	class="space-y-4"
>
	<SidebarWrapper bind:open={$activeChart} id="sidebar">
		<div class="space-y-3">
			<div class="text-xs space-y-1">
				<p>Datasets</p>
				<DatasetDropDown />
				<div class="text-xs space-y-1">
					<p>Axis</p>
				</div>
				<AxisDropDrown axis={'X'} />
				<AxisDropDrown axis={'Y'} />
				<div class="text-xs space-y-1">
					<p>Aggregator</p>
				</div>
				<Aggregator />
				<div class="text-xs space-y-1">
					<p>Groupby</p>
				</div>

				<Groupby />
				<div class="text-xs space-y-1">
					<p>ClearChartOptions</p>
					<ClearChartOptions />
				</div>
			</div>
		</div>
	</SidebarWrapper>
</div>
