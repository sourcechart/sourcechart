<script lang="ts">
	import ChooseLayer from './layer-components/ChooseLayer.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';

	let counter = 0;
	let layers: any[] = [];

	const addLayerToList = () => {
		counter += 1;
		layers = [...layers, { component: ChooseLayer, id: counter }];
	};
</script>

<div class="w-full">
	<div class="flex justify-between items-center w-full">
		<span class="text-sm font-light text-neutral-300">Layers</span>
		<button on:click={addLayerToList} class="bg-neutral-900 w-28"> Add Layer </button>
	</div>

	<div class="w-full">
		<div class="flex flex-col mt-4">
			{#each layers as layer}
				<div class="block mb-3">
					<svelte:component this={layer.component} />
				</div>
			{/each}
		</div>
	</div>
</div>
