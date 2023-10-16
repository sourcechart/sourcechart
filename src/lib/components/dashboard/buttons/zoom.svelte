<script lang="ts">
	import { scale, polygons } from '$lib/io/Stores';
	import { scaleRectangle } from '$lib/components/dashboard/canvas/draw-utils/PolygonOperations';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import Minus from '$lib/components/ui/icons/Minus.svelte';

	const increaseZoom = () => {
		applyZoom(true); // zoom in
	};

	const decreaseZoom = () => {
		applyZoom(false); // zoom out
	};

	const applyZoom = (zoomIn: boolean) => {
		const currentScale = $scale;
		let newValue: number;
		let relativeScaleFactor: number;

		if (zoomIn) {
			newValue = currentScale + 0.1; // Adjusted for 20%
		} else {
			newValue = currentScale - 0.1; // Adjusted for 20%
		}

		relativeScaleFactor = newValue / currentScale;
		newValue = Math.max(newValue, 0.2); // Ensure it doesn't go below 0.2 to match the 20% decrease

		scale.set(newValue);

		polygons.update((polys) => {
			return polys.map((poly) => {
				return scaleRectangle(poly, relativeScaleFactor);
			});
		});
	};
</script>

<div class="flex justify-center h-10 w-32 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="divide-neutral-700 flex items-center justify-between space-x-2">
		<button on:click={decreaseZoom}>
			<Minus class="w-6 h-6 " />
		</button>

		<span>
			{Math.round($scale * 100) + '%'}
		</span>

		<button on:click={increaseZoom}>
			<PlusSolid class="w-6 h-6 " />
		</button>
	</div>
</div>
