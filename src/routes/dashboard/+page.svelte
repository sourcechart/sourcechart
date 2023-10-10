<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/dashboard/canvas/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import MobileSidebar from '$lib/components/dashboard/sidebar/MobileSidebar.svelte';
	import FileUploadPanel from '$lib/components/dashboard/fileuploadpanel/FileUploadPanel.svelte';
	import { onMount } from 'svelte';
	import { activeDropZone, keyPress } from '$lib/io/Stores';
	import { setLocalStorage } from '$lib/io/Storage';

	setLocalStorage('color-theme', 'dark');

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
			<FileUploadPanel />
		</div>
	{/if}
</div>
