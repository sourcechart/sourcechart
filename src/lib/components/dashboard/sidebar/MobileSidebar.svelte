<script lang="ts">
	import Trash from '$lib/components/ui/icons/Trash.svelte';
	import AcademiconsOpenData from '$lib/components/ui/icons/AcademiconsOpenData.svelte';
	let activeIndex: number | null = null;
	import { mobileNav } from '$lib/io/Stores';

	const setMode = (mode: MobileBar, clickedIndex: number) => {
		mobileNav.set(mode);
		activeIndex = clickedIndex;
	};

	let icons: { name: string; mode: MobileBar; component: any; index: number }[] = [
		{ name: 'Trash', component: Trash, index: 0, mode: 'trash' },
		{ name: 'AcademiconsOpenData', component: AcademiconsOpenData, mode: 'sidebar', index: 1 }
	];
</script>

<div class="flex justify-center h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="flex items-center justify-center space-x-3 ml-1 mr-1">
		{#each icons as { name, component, index, mode } (name)}
			<button
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex ? 'selected' : ''
				}`}
				on:click={() => setMode(mode, index)}
			>
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} />
				</div>
			</button>
		{/each}
	</div>
</div>
