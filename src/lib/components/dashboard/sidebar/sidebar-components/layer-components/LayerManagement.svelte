<script lang="ts">
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	//import ScatterplotLayer from './ScatterplotLayer.svelte';
	//import PolygonLayer from './PolygonLayer.svelte';
	//import TripsLayer from './TripsLayer.svelte';
	//import PathLayer from './PathLayer.svelte';
	//import LineLayer from './LineLayer.svelte';
	//import ArcLayer from './ArcLayer.svelte';
	import H3Layer from './H3Layer.svelte';
	//import ColorDropdown from './utils/ColorDropdown.svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	export let id: string;
	export let defaultLayer: LayerOptions['layer'];
	let currentLayer: string = defaultLayer.layerType || 'Select Layer';

	let container: HTMLElement;
	let deckGlLayers = [
		//'PolygonLayer',
		//'PathLayer',
		//'ArcLayer',
		//'LineLayer',
		//'ScatterplotLayer',
		//'TripsLayer',
		'H3HexagonLayer'
	];

	onMount(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	});

	const dispatch = createEventDispatcher();

	function selectLayer(layerName: string) {
		currentLayer = layerName;
		isDropdownOpen = false;
	}

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	function removeLayer() {
		currentLayer = 'Select Layer';
		dispatch('closeLayer', id); // Emitting a custom event with the layer's ID.
	}

	const handleOutsideClick = (event: MouseEvent) => {
		if (container && !container.contains(event.target as Node)) {
			isDropdownOpen = false;
		}
	};
</script>

<div bind:this={container}>
	<div class="relative">
		<button
			aria-label="Toggle Dropdown"
			class="mx-auto bg-neutral-900 w-full rounded-sm justify-center hover:bg-neutral-900/50 flex-grow flex items-center text-center border-neutral-700/50"
			on:click={toggleDropdown}
		>
			<span class="text-sm text-neutral-300 ml-1">{currentLayer}</span>
			<button
				class="p-0 ml-auto"
				on:click={(e) => {
					removeLayer();
					e.stopPropagation();
				}}
			>
				<CloseSolid class="w-5 h-5 text-gray-300 hover:text-gray-100" />
			</button>
		</button>

		{#if isDropdownOpen}
			<div
				class="scrollBarDiv h-36 bg-neutral-900 rounded-md absolute w-full left-0 top-full mt-1 transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each deckGlLayers as layer}
					<button
						class="block w-full text-left px-3 py-2 text-gray-300 hover:bg-neutral-700 font-thin text-sm truncate"
						on:click={() => selectLayer(layer)}
					>
						{layer}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
<!--
{#if currentLayer === 'PolygonLayer'}
	<PolygonLayer {id} />
{:else if currentLayer === 'PathLayer'}
	<PathLayer {id} />
{:else if currentLayer === 'ArcLayer'}
	<ArcLayer {id} />
{:else if currentLayer === 'LineLayer'}
	<LineLayer {id} />
{:else if currentLayer === 'ScatterplotLayer'}
	<ScatterplotLayer {id} />
{:else if currentLayer === 'TripsLayer'}
	<TripsLayer {id} />
{:else if currentLayer === 'H3HexagonLayer'}
	
-->

<H3Layer {id} {defaultLayer} />

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
