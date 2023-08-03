<script lang="ts">
	import { Tags } from './sidebar-components';
	import { Groupby, ChartDropdown } from './sidebar-components';
	import { Range } from 'flowbite-svelte';
	let minmaxValue = 5;
</script>

<div class="space-y-3 mt-3">
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Add Attributes</p>
		<Groupby ButtonName={'Add Attributes'} />
		<Tags />
	</div>
	<div class="flex flex-col space-y-1">
		<p class="text-xs">Choose Chart</p>
		<ChartDropdown sideBarVersion={'WorkFlow'} />
	</div>
	<div>
		<p class="text-xs">Minimum Distance between Points</p>
		<Range id="range-minmax" min="0" max="10" bind:value={minmaxValue} />
	</div>
</div>
