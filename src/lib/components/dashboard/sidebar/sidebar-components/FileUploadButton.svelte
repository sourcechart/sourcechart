<script lang="ts">
	import { fileDropdown } from '$lib/io/Stores';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';

	$: numberOfDatasets = fileDropdown();

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<button
	class="block w-full text-left px-3 py-2 dark:text-black hover:bg-gray-200"
	on:click={handleClick}
>
	<div class="flex justify-between items-center w-full">
		<span>Add Dataset [{$numberOfDatasets.length}]</span>
		<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
	</div>
</button>
