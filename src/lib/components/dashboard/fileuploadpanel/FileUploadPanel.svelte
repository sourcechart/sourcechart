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
	class="relative bg-[#2c2d2d] px-6 pb-16 pt-20 shadow-xl h-96 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-xl sm:rounded-lg sm:px-10"
>
	<ExternalDatasets />
</div>

<!--
		<Tabs style="underline" contentClass="p-4 rounded-lg mt-4 text-neutral-300">
			<TabItem class="" title="Load Files" open>
				<DropZone />
			</TabItem>

			<TabItem title="External Datasets">
			</TabItem>
		</Tabs>
	-->

<style>
	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
	}
</style>
