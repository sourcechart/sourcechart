<script lang="ts">
	import Bar from '$lib/components/ui/colorbar/Bar.svelte';
	import { ColorScales } from '$lib/components/ui/colorbar/ColorScale';

	let container: HTMLElement;
	let open: boolean = false;
	let selectedColorScale: string = 'Viridis';

	const colorValueArray = Object.keys(ColorScales).map((key) => ColorScales[key]);

	function handleButtonClick(scale: string) {
		selectedColorScale = scale;
		console.log(`Color scale ${scale} was clicked`);
	}
</script>

{#each colorValueArray as scale}
	<button on:click={() => handleButtonClick(scale)}>
		<Bar selectedColorScale={scale} />
	</button>
{/each}

<div {...$$props} bind:this={container}>
	<div class="relative">
		<button
			aria-label="Toggle Dropdown"
			class="mx-auto bg-neutral-900 w-full rounded-sm justify-center hover:bg-neutral-900/50 flex-grow flex items-center text-center border-neutral-700/50"
			on:click={() => (open = !open)}
		>
			<Bar {selectedColorScale} />
		</button>

		{#if open}
			<div
				class="scrollBarDiv bg-neutral-900 rounded-md absolute w-full left-0 top-full mt-1 transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each colorValueArray as scale}
					<button on:click={() => handleButtonClick(scale)}>
						<Bar selectedColorScale={scale} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
