<script lang="ts">
	import Tabs from '$lib/components/ui/tabs/Tabs.svelte'; //@ts-ignore
	import CloseSolid from '$lib/components/ui/icons/CloseSolid.svelte';

	import DropZone from './components/DropZone.svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import ExternalDatasets from './components/ExternalDatasets.svelte';

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
		}
	];
</script>

<div
	class="relative bg-[#2c2d2d] px-6 pb-8 pt-3 shadow-xl ring-1 ring-gray-900/5 w-auto sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-full">
		<h1 class="text-2xl text-gray-300">Add Data to Plot</h1>
		<button class="absolute top-3 right-3" on:click={handleClick}>
			<CloseSolid />
		</button>
		<div class="mt-4">
			<Tabs {items} />
		</div>
	</div>
</div>
