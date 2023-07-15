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
		<div class="space-y-3">
			<div class="flex items-center space-x-1">
				<p class="text-xs">FileUpload</p>
				<FileUpload />
			</div>
			<div class="flex items-center space-x-1">
				<p class="text-xs">Datasets</p>
				<DatasetDropDown />
			</div>
			<div class="flex items-center">
				<p class="text-xs">Choose Chart</p>
				<PlotDropdown />
			</div>
			<div class="flex items-center">
				<p class="text-xs">Axis</p>
				<AxisDropDrown axis={'X'} />
				<AxisDropDrown axis={'Y'} />
			</div>
			<div class="flex items-center">
				<p class="text-xs">Aggregator</p>
				<Aggregator />
			</div>
			<div class="flex items-center">
				<p class="text-xs">Groupby</p>
				<Groupby />
			</div>
			<Tags />
		</div>
	</SidebarWrapper>
</div>
