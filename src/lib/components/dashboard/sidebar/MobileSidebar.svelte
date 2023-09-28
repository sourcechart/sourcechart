<script lang="ts">
	import Menu from '$lib/components/ui/icons/Menu.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	import { mobileNav, activeSidebar } from '$lib/io/Stores';

	let activeIndex: number | null = null;

	const setMode = (mode: MobileBar, clickedIndex: number) => {
		mobileNav.set(mode);

		if (mode === 'sidebar') {
			activeSidebar.set(true);
		} else {
			activeSidebar.set(false);
		}

		activeIndex = clickedIndex;
	};

	let icons: { name: string; mode: MobileBar; component: any; index: number }[] = [
		{ name: 'AcademiconsOpenData', component: Menu, mode: 'sidebar', index: 1 },
		{ name: 'Trash', component: CloseSolid, index: 0, mode: 'trash' }
	];
</script>

<div class="flex justify-center w-40 h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="flex items-center justify-center space-x-16 ml-1 mr-1">
		{#each icons as { name, component, index, mode } (name)}
			<button
				class="flex items-center justify-center mx-1 rounded-md overflow-hidden"
				on:click={(e) => {
					e.stopPropagation();
					setMode(mode, index);
				}}
			>
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} />
				</div>
			</button>
		{/each}
	</div>
</div>
