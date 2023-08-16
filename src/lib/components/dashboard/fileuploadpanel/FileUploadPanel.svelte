<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import DropZone from './components/DropZone.svelte';
	import { CloseButton } from 'flowbite-svelte';
	import { activeDropZone } from '$lib/io/Stores';

	const handleClick = () => {
		activeDropZone.set(false);
	};
</script>

<div
	class="relative dark:bg-gray-700 bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5
		   sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-md">
		<h1 class="text-xl dark:text-gray-300">Add Data to Plot</h1>
		<CloseButton on:click={handleClick} />
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
