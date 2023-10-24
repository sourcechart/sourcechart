<script lang="ts">
	import ChooseLayer from './layer-components/ChooseLayer.svelte';

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
		<button on:click={addLayerToList} class="bg-neutral-900 w-28"> Add Layer </button>
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
