<script lang="ts">
	import {
		DatasetDropDown,
		AxisDropDrown,
		Aggregator,
		Groupby,
		FileUpload,
		ChartDropdown,
		Tags
	} from './sidebar-components';
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Datasets</p>
		<DatasetDropDown />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Chart</p>
		<ChartDropdown />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Axis</p>
		<AxisDropDrown axis={'X'} />
		<AxisDropDrown axis={'Y'} />
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
