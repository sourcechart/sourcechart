<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/dashboard/canvas/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import FileUploadPanel from '$lib/components/dashboard/fileuploadpanel/FileUploadPanel.svelte';
	import Help from '$lib/components/ui/icons/Help.svelte';
	import Safety from '$lib/components/ui/icons/Safety.svelte';
	import ToggleSidebar from '$lib/components/dashboard/sidebar/ToggleSidebar.svelte';

	import { onMount } from 'svelte';
	import { activeDropZone, keyPress, tabValue, responsiveType, screenSize } from '$lib/io/Stores';

	let hoverHelp = false; // Declare a new variable
	let hoverSecure = false;
	let width: number = 0;

	let isPressedHelp = false;
	let isPressedSecure = false;
	let pressTimeoutHelp: NodeJS.Timeout;
	let pressTimeoutSecure: NodeJS.Timeout;

	onMount(() => {
		width = window.innerWidth;
		handleResize();
		window.addEventListener('resize', handleResize);
		document.addEventListener('keydown', handleKeyPress);

		return () => {
			document.removeEventListener('keydown', handleKeyPress);
			window.removeEventListener('resize', handleResize);
		};
	});

	function handleKeyPress(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			activeDropZone.set(false);
		} else if (['0', '1', '2', '3'].includes(event.key)) {
			keyPress.set(event.key);
		}
	}

	const startPressHelp = (): void => {
		isPressedHelp = true;
		pressTimeoutHelp = setTimeout(() => {
			if (isPressedHelp) hoverHelp = true;
		}, 800);
	};

	const endPressHelp = (): void => {
		isPressedHelp = false;
		clearTimeout(pressTimeoutHelp);
		hoverHelp = false;
	};

	const startPressSecure = (): void => {
		isPressedSecure = true;
		pressTimeoutSecure = setTimeout(() => {
			if (isPressedSecure) hoverSecure = true;
		}, 800);
	};

	const endPressSecure = (): void => {
		isPressedSecure = false;
		clearTimeout(pressTimeoutSecure);
		hoverSecure = false;
	};

	const handleResize = (): void => {
		var sc = width <= 768 ? 'small' : 'large';
		screenSize.set(sc);
	};
</script>

<div class="w-screen h-screen overflow-hidden bg-neutral-900 }">
	<div class="flex justify-center items-center fixed top-4 left-1/2 -translate-x-1/2 z-10">
		<NavBar />
	</div>

	<div class="absolute z-10 ml-6 mt-6">
		<Sidebar />
		<ToggleSidebar />
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

	<div
		class={`fixed bottom-4 right-20 z-40 bg-neutral-800 w-8 h-8 flex justify-center items-center rounded-md ${
			isPressedSecure ? 'bg-purple-400' : ''
		}`}
		on:mouseenter={() => (hoverSecure = true)}
		on:mouseleave={() => (hoverSecure = false)}
		on:mousedown={startPressSecure}
		on:mouseup={endPressSecure}
		on:touchstart={startPressSecure}
		on:touchend={endPressSecure}
	>
		{#if hoverSecure && ($responsiveType === 'touch' || isPressedSecure)}
			<div
				class="absolute mt-2 w-48 p-2 bg-neutral-700 text-neutral-200 rounded-md text-sm right-full mr-2 transform translate-x-25 shadow-lg"
			>
				Your data never leaves your computer
			</div>
		{/if}
		<Safety
			class={`text-purple-300 ${isPressedSecure ? 'text-purple-600' : 'hover:text-purple-400'}`}
		/>
	</div>

	<button
		class={`fixed bottom-4 right-4 z-40 bg-neutral-800 w-8 h-8 flex justify-center items-center rounded-md ${
			isPressedHelp ? 'bg-neutral-500' : ''
		}`}
		on:click={() => {
			activeDropZone.set(true);
			tabValue.set(2);
		}}
		on:mouseenter={() => (hoverHelp = true)}
		on:mouseleave={() => (hoverHelp = false)}
		on:mousedown={startPressHelp}
		on:mouseup={endPressHelp}
		on:touchstart={startPressHelp}
		on:touchend={endPressHelp}
	>
		{#if hoverHelp && ($responsiveType === 'touch' || isPressedHelp)}
			<div
				class="absolute mt-2 w-48 p-2 bg-neutral-700 text-neutral-200 rounded-md text-sm right-full mr-2 transform translate-x-25 shadow-lg"
			>
				Open Help and Tips
			</div>
		{/if}
		<Help
			class={`text-neutral-300 ${isPressedHelp ? 'text-neutral-600' : 'hover:text-neutral-400'}`}
		/>
	</button>
</div>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
		}
	}}
/>
