<script lang="ts">
	import Tabs from '$lib/components/ui/tabs/Tabs.svelte'; //@ts-ignore
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';
	import DropZone from './components/DropZone.svelte';
	import ExternalDatasets from './components/ExternalDatasets.svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import Tutorials from './components/Tutorials.svelte';
	import CheatSheet from './components/CheatSheet.svelte';

	const handleClick = () => {
		activeDropZone.set(false);
		activeSidebar.set(true);
	};

	let items = [
		{
			title: 'Load Files',
			component: DropZone,
			value: 1
		},
		{
			title: 'External Datasets',
			component: ExternalDatasets,
			value: 2
		},
		{
			title: 'Cheat Sheet',
			component: CheatSheet,
			value: 3
		}
	];
</script>

<div
	class="relative bg-white overflow-auto scrollBarDiv px-4 pb-8 w-full h-3/5 pt-6 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-3xl sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-full">
		<h1 class="text-2xl text-gray-800 font-normal">Add Data to Plot</h1>
		<button class="absolute top-3 right-3" on:click={handleClick}>
			<CloseSolid class="text-black h-6 w-6" />
		</button>
		<div class="mt-4 w-full">
			<Tabs {items} />
		</div>
	</div>
</div>

<style>
	.scrollBarDiv {
		/* Remove the fixed height */
		max-height: 36rem; /* Or adjust this to a value that fits your design better */

		/* Overflow properties */
		overflow-y: auto;
		overflow-x: auto;

		/* Scrollbar styles for Webkit browsers */
		scrollbar-width: thin;
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
	}
</style>
