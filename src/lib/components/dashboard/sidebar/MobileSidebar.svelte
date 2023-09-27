<script lang="ts">
	import Trash from '$lib/components/ui/icons/Trash.svelte';
	import Menu from '$lib/components/ui/icons/Menu.svelte';
	import AcademiconsOpenData from '$lib/components/ui/icons/AcademiconsOpenData.svelte';
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	import { mobileNav, activeSidebar } from '$lib/io/Stores';
	import { onMount } from 'svelte';

	let activeIndex: number | null = null;
	let mobileSidebar: HTMLElement;

	const setMode = (mode: MobileBar, clickedIndex: number) => {
		mobileNav.set(mode);

		if (mode === 'sidebar') {
			activeSidebar.set(true);
		} else {
			activeSidebar.set(false);
		}

		activeIndex = clickedIndex;
	};

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!mobileSidebar.contains(event.target as Node)) {
				activeSidebar.set(false);
				activeIndex = null;
			}
		};

		document.addEventListener('click', handleClickOutside, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	let icons: { name: string; mode: MobileBar; component: any; index: number }[] = [
		{ name: 'AcademiconsOpenData', component: Menu, mode: 'sidebar', index: 1 },
		{ name: 'Trash', component: CloseSolid, index: 0, mode: 'trash' }
	];
</script>

<div
	bind:this={mobileSidebar}
	class="flex justify-center w-40 h-10 items-center rounded-md shadow-lg bg-neutral-800"
>
	<div class="flex items-center justify-center space-x-16 ml-1 mr-1">
		{#each icons as { name, component, index, mode } (name)}
			<button
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex ? 'bg-[#9d99dc77]' : ''
				}`}
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
