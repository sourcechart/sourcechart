<script lang="ts">
	import ArcLayer from './ArcLayer.svelte';
	import LineLayer from './LineLayer.svelte';
	import PolygonLayer from './PolygonLayer.svelte';
	import PathLayer from './PathLayer.svelte';
	import ScatterplotLayer from './ScatterplotLayer.svelte';
	import { TripsLayer, H3HexagonLayer } from '@deck.gl/geo-layers';
	import { layers } from '$lib/io/Stores';
	import { createEventDispatcher } from 'svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	const dispatch = createEventDispatcher();

	export let id: string;

	let currentLayer: string = 'Select Layer';
	let deckGlLayers = [
		{
			name: 'PolygonLayer',
			component: PolygonLayer
		},

		{
			name: 'PathLayer',
			component: PathLayer
		},
		{
			name: 'ArcLayer',
			component: ArcLayer
		},
		{
			name: 'LineLayer',
			component: LineLayer
		},

		{
			name: 'ScatterplotLayer',
			component: ScatterplotLayer
		},
		{
			name: 'TripsLayer',
			component: TripsLayer
		},
		{
			name: 'H3',
			component: H3HexagonLayer
		}
	];

	function selectLayer(layerName: string) {
		currentLayer = layerName;
		isDropdownOpen = false;
	}

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function removeLayer() {
		deckGlLayers = deckGlLayers.filter((layer) => layer.name !== currentLayer);
		currentLayer = 'Select Layer';
		dispatch('closeLayer', id); // Emitting a custom event with the layer's ID.
	}
</script>

<div {id}>
	<button
		class="w-full py-1 rounded-sm bg-neutral-900 hover:bg-neutral-900/50 text-sm font-thin text-gray-100 flex justify-between items-center"
		on:click={toggleDropdown}
	>
		<span class="ml-2">{currentLayer}</span>
		<button
			class="p-0"
			on:click={(e) => {
				removeLayer();
				e.stopPropagation();
			}}
		>
			<CloseSolid class="w-5 h-5 text-gray-300 hover:text-gray-100" />
		</button>
	</button>
</div>

<div>
	{#if isDropdownOpen}
		<div
			class="w-48 top-0 absolute left-12 ml-2 mt-72 bg-neutral-900 rounded-md h-48 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 scrollBarDiv"
		>
			{#each deckGlLayers as layer (layer.name)}
				<button
					class="w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300"
					on:click={() => selectLayer(layer.name)}
				>
					{layer.name}
				</button>
			{/each}
		</div>
	{/if}
</div>
{#if currentLayer === 'PolygonLayer'}
	<PolygonLayer />
{:else if currentLayer === 'PathLayer'}
	<PathLayer />
{:else if currentLayer === 'ArcLayer'}
	<ArcLayer />
{:else if currentLayer === 'LineLayer'}
	<LineLayer />
{:else if currentLayer === 'ScatterplotLayer'}
	<ScatterplotLayer />
{:else if currentLayer === 'TripsLayer'}
	<!-- As TripsLayer and H3HexagonLayer are imported from @deck.gl/geo-layers, their usage might be different than the typical Svelte components. Ensure you use them as intended. -->
	<TripsLayer />
{:else if currentLayer === 'H3'}
	<H3HexagonLayer />
{/if}

<style>
	.scrollBarDiv::-webkit-scrollbar {
		width: 8px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 4px;
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}
</style>
