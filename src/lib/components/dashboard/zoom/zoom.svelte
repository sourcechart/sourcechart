<script lang="ts">
	import { scale } from '$lib/io/Stores';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import Minus from '$lib/components/ui/icons/Minus.svelte';
	import { onMount } from 'svelte';

	const increaseZoom = () => {
		scale.set($scale + 0.1); // increase by 10%
	};

	const decreaseZoom = () => {
		if ($scale > 0.1) {
			// ensure it doesn't go below 0
			scale.set($scale - 0.1); // decrease by 10%
		}
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
