<script lang="ts">
	import { Tags } from './sidebar-components';
	import { Groupby, ChartDropdown } from './sidebar-components';
	import { Range } from 'flowbite-svelte';
	import { epsilonDistance, minimimPointsForCluster } from '$lib/io/Stores';
	import { Input } from 'flowbite-svelte';

	let clusterSize = 5;
	let defaultEpsilon = 1;

	const handleEpsilonDistance = () => {
		epsilonDistance.update((epsilon) => {
			epsilon = defaultEpsilon;
			return epsilon;
		});
	};

	const handleClusterSize = () => {
		minimimPointsForCluster.update((minmumClusterSize) => {
			minmumClusterSize = clusterSize;
			return minmumClusterSize;
		});
	};
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
		<Range
			id="range-minmax"
			min="1"
			max="100"
			bind:value={defaultEpsilon}
			on:change={handleEpsilonDistance}
		/>
		<p class="text-xs">Distance between Points: {defaultEpsilon}</p>
	</div>
	<div>
		<p class="text-xs">Minimum Size of Groups</p>
		<Range
			id="range-minmax"
			min="1"
			max="100"
			bind:value={clusterSize}
			on:change={handleClusterSize}
		/>
		<p class="text-xs">Minimum Cluster Size: {clusterSize}</p>
	</div>
</div>
