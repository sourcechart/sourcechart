<script lang="ts">
	//@ts-ignore
	import Tabs from 'flowbite-svelte/Tabs.svelte'; //@ts-ignore
	import TabItem from 'flowbite-svelte/TabItem.svelte'; //@ts-ignore
	import CloseButton from 'flowbite-svelte/CloseButton.svelte';

	import DropZone from './components/DropZone.svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import ExternalDatasets from './components/ExternalDatasets.svelte';

	const handleClick = () => {
		activeDropZone.set(false);
		activeSidebar.set(true);
	};
</script>

<div
	class="relative filePanelBackground px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 w-auto sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10 overflow-hidden"
>
	<div class="mx-auto max-w-full">
		<h1 class="text-xl text-gray-300">Add Data to Plot</h1>
		<div class="close-button">
			<CloseButton class="close-button" on:click={handleClick} />
		</div>
		<Tabs style="underline" contentClass="p-4 rounded-lg mt-4">
			<TabItem title="Load Files" open>
				<DropZone />
			</TabItem>
			<TabItem title="External Datasets">
				<ExternalDatasets />
			</TabItem>
		</Tabs>
	</div>
</div>

<style>
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
	}
	.filePanelBackground {
		background-color: #2c2d2d;
	}
</style>
