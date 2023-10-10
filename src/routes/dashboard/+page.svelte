<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/dashboard/canvas/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import MobileSidebar from '$lib/components/dashboard/sidebar/MobileSidebar.svelte';
	import FileUploadPanel from '$lib/components/dashboard/fileuploadpanel/FileUploadPanel.svelte';
	import Help from '$lib/components/ui/icons/Help.svelte';
	import Safety from '$lib/components/ui/icons/Safety.svelte';
	import { onMount } from 'svelte';
	import { activeDropZone, keyPress, tabValue } from '$lib/io/Stores';
	import { setLocalStorage } from '$lib/io/Storage';

	setLocalStorage('color-theme', 'dark');
	let hoverHelp = false; // Declare a new variable
	let hoverSecure = false;
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			activeDropZone.set(false);
		} else if (['0', '1', '2', '3'].includes(event.key)) {
			keyPress.set(event.key);
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	});
</script>

<div class="w-screen h-screen overflow-hidden bg-neutral-900 }">
	<div class="flex justify-center items-center fixed top-4 left-1/2 -translate-x-1/2 z-10">
		<NavBar />
	</div>

	<div
		class="flex justify-center items-center fixed bottom-4 left-1/2 -translate-x-1/2 z-10 sm:block md:hidden"
	>
		<MobileSidebar />
	</div>

	<div class="absolute z-10 ml-6 mt-6">
		<Sidebar />
	</div>

	<div class="relative z-0 w-screen h-screen">
		<Canvas />
	</div>

	{#if $activeDropZone}
		<div class="z-20 fixed inset-0 bg-black/60" />

		<div class="z-30 fixed inset-0 flex justify-center items-center w-screen h-screen">
			<FileUploadPanel activeTabValue={$tabValue} />
		</div>
	{/if}

	<div
		class="fixed bottom-4 right-20 z-40 bg-neutral-800 w-8 h-8 flex justify-center items-center rounded-md"
		on:mouseenter={() => (hoverSecure = true)}
		on:mouseleave={() => (hoverSecure = false)}
	>
		{#if hoverSecure}
			<!-- Tooltip display condition -->
			<div
				class="absolute mt-2 w-48 p-2 bg-neutral-700 text-neutral-200 rounded-md text-sm right-full mr-2 transform translate-x-25 shadow-lg"
			>
				Your data never leaves your computer
			</div>
		{/if}
		<Safety class="text-purple-300 hover:text-purple-400" />
	</div>

	<button
		class="fixed bottom-4 right-4 z-40 bg-neutral-800 w-8 h-8 flex justify-center items-center rounded-md"
		on:click={() => {
			activeDropZone.set(true);
			tabValue.set(2);
		}}
		on:mouseenter={() => (hoverHelp = true)}
		on:mouseleave={() => (hoverHelp = false)}
	>
		{#if hoverHelp}
			<!-- Tooltip display condition -->
			<div
				class="absolute mt-2 w-48 p-2 bg-neutral-700 text-neutral-200 rounded-md text-sm right-full mr-2 transform translate-x-25 shadow-lg"
			>
				Open Help and Tips
			</div>
		{/if}
		<Help class="text-white hover:text-neutral-100" />
	</button>
</div>
