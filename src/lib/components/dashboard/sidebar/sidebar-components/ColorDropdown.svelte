<script lang="ts">
	import Bar from '$lib/components/ui/colorbar/Bar.svelte';
	import { ColorScales } from '$lib/components/ui/colorbar/ColorScale';

	let container: HTMLElement;
	let open: boolean = false;
	let selectedColorScale = ColorScales.BLUES;

	//@ts-ignore
	const colorValueArray = Object.keys(ColorScales).map(
		(key) => ColorScales[key as keyof typeof ColorScales]
	);

	function handleButtonClick(scale: ColorScales) {
		selectedColorScale = scale;
		open = false;
	}
</script>

<div class={$$props.class} bind:this={container}>
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
				class="scrollBarDiv h-40 bg-neutral-900 rounded-md absolute w-full left-0 top-full mt-1 transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
			>
				{#each colorValueArray as scale}
					<button on:click={() => handleButtonClick(ColorScales[scale])} class="w-full h-4">
						<Bar selectedColorScale={scale} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 4px; /* Change this value to make the scrollbar thinner or thicker */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 2px; /* Adjust the border-radius as per the new width */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin; /* This property can have values of "none", "auto", "thin", and "wide" */
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
	}
</style>
