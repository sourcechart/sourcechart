<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		ClearChartOptions,
		FileUpload,
		PlotDropdown
	} from './sidebar-components';
	import { SidebarWrapper } from '$lib/components/ui';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar, mostRecentChartID } from '$lib/io/Stores';

	$: console.log($mostRecentChartID);
	function handleInside(event: Event) {
		//@ts-ignore
		$mostRecentChartID = event.target.id;
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
				<p>FileUpload</p>
			</div>
			<FileUpload />
			<div class="text-xs space-y-1">
				<p>Datasets</p>
			</div>
			<DatasetDropDown />

			<div class="text-xs space-y-1">
				<p>Choose Chart</p>
			</div>
			<PlotDropdown />
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
			</div>
			<ClearChartOptions />
		</div>
	</SidebarWrapper>
</div>
