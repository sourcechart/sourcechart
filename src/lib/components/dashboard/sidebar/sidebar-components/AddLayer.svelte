<script lang="ts">
	import ChooseLayer from './layer-components/ChooseLayer.svelte';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import { generateID } from '$lib/io/GenerateID';
	import { layers, allCharts, clickedChartIndex } from '$lib/io/Stores';

	$: i = clickedChartIndex();
	let counter = 0;

	let newLayers: any[] = [];
	$: if ($allCharts && $allCharts.length > 0 && $allCharts[$i]) {
		const savedLayers = $allCharts[$i].layers || [];
		newLayers = savedLayers.map((layer) => {
			return {
				component: ChooseLayer,
				id: layer.layerID,
				defaultLayer: layer.layer // Assuming layerType or similar property exists
			};
		});
	}

	const addLayerToList = () => {
		counter += 1;
		newLayers = [...newLayers, { component: ChooseLayer, id: generateID(), defaultLayer: {} }];
	};

	function handleLayerClosed(event: CustomEvent) {
		const layerIdToRemove = event.detail;
		newLayers = newLayers.filter((layer) => layer.id !== layerIdToRemove);
		allCharts.update((currentCharts) => {
			let updatedCharts = [...currentCharts];
			updatedCharts[$i].layers = updatedCharts[$i].layers.filter(
				(l) => l.layerID !== layerIdToRemove
			);
			return updatedCharts;
		});
		layers.update((currentLayers) => {
			let updatedLayers = currentLayers.filter((layer) => layer.id !== layerIdToRemove);
			return updatedLayers;
		});
	}
</script>

<div class="w-full">
	<div class="flex justify-between items-center w-full">
		<span class="text-sm font-light text-neutral-300">Layers</span>
		<button
			on:click={() => {
				addLayerToList();
			}}
			class="bg-neutral-900 w-32 flex justify-center"
		>
			<span class="mt-0.5 flex">Add Layer </span>
			<PlusSolid class="w-8 h-8 text-gray-300 hover:text-gray-100" />
		</button>
	</div>

	<div class="w-full">
		<div class="flex flex-col mt-4">
			{#each newLayers as nl}
				<div class="block mb-3">
					<svelte:component
						this={nl.component}
						id={nl.id}
						defaultLayer={nl.defaultLayer}
						on:closeLayer={handleLayerClosed}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
