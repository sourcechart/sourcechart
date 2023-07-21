<script lang="ts">
	import { DatasetDropDown, ChooseIDColumn, Tags } from './sidebar-components';
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Dataset</p>
		<DatasetDropDown />
	</div>
	<div class="flex flex-col space-y-1">
		<ChooseIDColumn />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Add Attributes</p>
		<Tags />
	</div>
</div>
