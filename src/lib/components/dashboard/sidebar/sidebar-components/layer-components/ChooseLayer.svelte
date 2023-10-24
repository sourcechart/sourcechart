<script lang="ts">
	import {
		ArcLayer,
		PolygonLayer,
		PointCloudLayer,
		PathLayer,
		ScatterPlotLayer,
		LineLayer,
		TextLayer,
		IconLayer,
		GeoJsonLayer,
		GridLayer,
		HexagonLayer
	} from '@deck.gl/layers';

	let layers = [
		{
			name: 'HexagonLayer',
			component: HexagonLayer
		},
		{
			name: 'PolygonLayer',
			component: PolygonLayer
		},
		{
			name: 'PointCloudLayer',
			component: PointCloudLayer
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
			name: 'TextLayer',
			component: TextLayer
		},
		{
			name: 'IconLayer',
			component: IconLayer
		},
		{
			name: 'GeoJsonLayer',
			component: GeoJsonLayer
		},
		{
			name: 'GridLayer',
			component: GridLayer
		},
		{
			name: 'ScatterPlotLayer',
			component: ScatterPlotLayer
		}
	];

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}
</script>

<button
	class="w-full py-1 ml-2 rounded-sm bg-neutral-900 hover:bg-neutral-900/50 text-sm font-thin text-gray-100"
	on:click={toggleDropdown}
>
	Select Layer
</button>

{#if isDropdownOpen}
	<div
		class="w-48 top-0 absolute left-12 ml-2 mt-72 bg-neutral-900 rounded-md h-48 shadow-lg transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10 scrollBarDiv"
	>
		{#each layers as layer (layer.name)}
			<button
				class="w-full text-left px-3 py-2 hover:bg-neutral-700 font-thin text-sm text-gray-300"
				on:click={() => {}}
			>
				{layer}
			</button>
		{/each}
	</div>
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
