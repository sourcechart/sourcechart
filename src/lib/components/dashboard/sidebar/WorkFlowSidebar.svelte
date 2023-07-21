<script lang="ts">
	import { DatasetDropDown, ColumnDropDrown, Groupby, Tags } from './sidebar-components';
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Dataset</p>
		<DatasetDropDown />
	</div>
	<div class="flex flex-col space-y-1">
		<ColumnDropDrown axis={'X'} />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Groupby</p>
		<Groupby />
		<Tags />
	</div>
</div>
