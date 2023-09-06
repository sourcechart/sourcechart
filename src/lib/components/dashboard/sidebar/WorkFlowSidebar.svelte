<script lang="ts">
	import { Tags } from './sidebar-components';
	import { Groupby, ChartDropdown } from './sidebar-components'; //@ts-ignore
	import { epsilonDistance, minimumPointsForCluster } from '$lib/io/Stores'; //@ts-ignore
	import Range from 'flowbite-svelte/Range.svelte'; //@ts-ignore
	import NumberInput from 'flowbite-svelte/NumberInput.svelte'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';

	let clusterSize = 5;
	let defaultEpsilon = 1;
	let maxRange = 1;
	let stepValue = maxRange / 100;

	const handleEpsilonDistance = () => {
		epsilonDistance.update((epsilon) => {
			epsilon = defaultEpsilon;
			return epsilon;
		});
	};

	const handleClusterSize = () => {
		minimumPointsForCluster.update((minimumClusterSize) => {
			minimumClusterSize = clusterSize;
			return minimumClusterSize;
		});
	};
</script>

<div class="space-y-3 mt-3 flex flex-col">
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-4">
			<span>Add Attributes</span>
		</Label>
		<Groupby ButtonName={'Add Attributes'} />
		<Tags />
	</div>
	<div class="flex flex-col space-y-1">
		<Label class="space-y-2 mb-4">
			<span>Choose Chart</span>
		</Label>
		<ChartDropdown sideBarVersion={'WorkFlow'} />
	</div>
	<div>
		<Label class="space-y-2 mb-4">
			<span>Minimum Distance between Points</span>
		</Label>
		<div class="flex-row">
			<Range
				id="range-minmax"
				min="0"
				max={maxRange}
				step={stepValue}
				bind:value={defaultEpsilon}
				on:change={handleEpsilonDistance}
			/>
			<p class="text-xs">Distance between Points: {defaultEpsilon}</p>
			<Label class="space-y-2 mb-4">
				<span>Max Range</span>
				<NumberInput bind:value={maxRange} />
			</Label>
		</div>
	</div>
	<div>
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
