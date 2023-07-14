<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		FileUpload,
		PlotDropdown
	} from './sidebar-components';
	import { SidebarWrapper } from '$lib/components/ui';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';

	const handleClickInside = () => {
		$activeSidebar = true;
	};
</script>

<div use:clickInside={{ clickInside: handleClickInside }} class="space-y-4">
	<SidebarWrapper bind:open={$activeSidebar} id="sidebar">
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
		</div>
	</SidebarWrapper>
</div>
