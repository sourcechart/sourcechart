<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import { fileDropdown } from '$lib/io/Stores';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';

	$: numberOfDatasets = fileDropdown();

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<Button outline color="light" id="multiple_files" on:click={handleClick}>
	<div class="flex justify-between items-center w-full">
		<span>Datasets [{$numberOfDatasets.length}]</span>
		<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
	</div>
</Button>
