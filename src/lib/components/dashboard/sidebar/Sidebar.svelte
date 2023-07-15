<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		FileUpload,
		PlotDropdown,
		Tags
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
		<div class="flex items-center space-x-1">
			<p>FileUpload</p>
			<FileUpload />
		</div>
		<div class="flex items-center space-x-1">
			<p>Datasets</p>
			<DatasetDropDown />
		</div>
		<div class="flex items-center">
			<div class=" text-xs space-y-1">
				<p>Choose Chart</p>
			</div>
			<PlotDropdown />
		</div>
		<div class="flex items-center">
			<div class="text-xs space-y-1">
				<p>Axis</p>
			</div>
			<AxisDropDrown axis={'X'} />
			<AxisDropDrown axis={'Y'} />
		</div>
		<div class="flex items-center">
			<div class="text-xs space-y-1">
				<p>Aggregator</p>
			</div>
			<Aggregator />
		</div>
		<div class="flex items-center">
			<div class="text-xs space-y-1">
				<p>Groupby</p>
			</div>
			<Groupby />
		</div>
		<Tags />
	</SidebarWrapper>
</div>
