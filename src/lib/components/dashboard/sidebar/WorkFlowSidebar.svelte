<script lang="ts">
	import { Tags } from './sidebar-components';
	import { Groupby, ChartDropdown } from './sidebar-components';
	import { Range } from 'flowbite-svelte';
	import { epsilonDistance, minimimPointsForCluster } from '$lib/io/Stores';
	import { NumberInput, Label } from 'flowbite-svelte';

	let clusterSize = 5;
	let defaultEpsilon = 1;
	let maxRange: number = 1;
	let stepValue = maxRange / 100;

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
				class="bg-slate-950"
				id="range-minmax"
				min="0"
				max={maxRange}
				step={stepValue}
				bind:value={defaultEpsilon}
				on:change={handleEpsilonDistance}
			/>
			<Label class="space-y-2 mb-4">
				<span>Max Range</span>
				<NumberInput bind:maxRange />
			</Label>
		</div>
	</div>
	<div>
		<Label class="space-y-2 mb-4">
			<span>Minimum Size of Groups</span>
			<NumberInput bind:maxRange />
		</Label>
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
