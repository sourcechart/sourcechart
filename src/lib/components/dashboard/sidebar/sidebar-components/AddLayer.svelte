<script lang="ts">
	import ChooseLayer from './layer-components/ChooseLayer.svelte';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';

	let counter = 0;
	let layers: any[] = [];

	const addLayerToList = () => {
		counter += 1;
		layers = [...layers, { component: ChooseLayer, id: counter }];
	};

	function handleLayerClosed(event: CustomEvent) {
		const layerIdToRemove = event.detail;
		layers = layers.filter((layer) => layer.id !== layerIdToRemove);
	}
</script>

<div class="w-full">
	<div class="flex justify-between items-center w-full">
		<span class="text-sm font-light text-neutral-300">Layers</span>
		<button on:click={addLayerToList} class="bg-neutral-900 w-32 flex justify-center">
			<span class="mt-0.5 flex">Add Layer </span>
			<PlusSolid class="w-8 h-8 text-gray-300 hover:text-gray-100" />
		</button>
	</div>

	<div class="w-full">
		<div class="flex flex-col mt-4">
			{#each layers as layer}
				<div class="block mb-3">
					<svelte:component
						this={layer.component}
						id={layer.id}
						on:closeLayer={handleLayerClosed}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
