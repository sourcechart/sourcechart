<script lang="ts">
	import { ColumnDropDrown, Aggregator, Groupby, ChartDropdown, Tags } from './sidebar-components'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-1">
			<span>Axis</span>
		</Label>
		<ColumnDropDrown axis={'X'} />
		<ColumnDropDrown axis={'Y'} />
	</div>
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-1">
			<span>Aggregator</span>
		</Label>
		<Aggregator />
	</div>
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-1">
			<span>GroupBy</span>
		</Label>
		<Groupby ButtonName={'Group By'} />
		<Tags />
	</div>
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-1">
			<span>Choose Chart</span>
		</Label>
		<ChartDropdown sideBarVersion={'LowCode'} />
	</div>
</div>
