<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import DropZone from './components/DropZone.svelte';
	import { CloseButton } from 'flowbite-svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';

	$: console.log($activeDropZone);
	const handleClick = () => {
		activeDropZone.set(false);
		activeSidebar.set(true);
	};
</script>

<div
	class="relative dark:bg-gray-700 bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5
		   sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-md">
		<h1 class="text-xl dark:text-gray-300">Add Data to Plot</h1>
		<div class="close-button">
			<CloseButton class="close-button" on:click={handleClick} />
		</div>
		<Tabs style="underline" contentClass="p-4 rounded-lg mt-4">
			<TabItem title="Load Files" open>
				<DropZone />
			</TabItem>
			<TabItem title="External Datasets">
				<p>PlaceHolder</p>
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
</style>
