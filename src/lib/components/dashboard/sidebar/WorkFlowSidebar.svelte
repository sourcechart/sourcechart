<script lang="ts">
	import { ChooseIDColumn, Tags } from './sidebar-components';
	import { Groupby, ChartDropdown } from './sidebar-components';
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Add Attributes</p>
		<Groupby />
		<Tags />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Chart</p>
		<ChartDropdown sideBarVersion={'WorkFlow'} />
	</div>
</div>
