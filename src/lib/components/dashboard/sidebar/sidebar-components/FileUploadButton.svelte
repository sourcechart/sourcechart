<script lang="ts">
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import { PlusSolid } from 'flowbite-svelte-icons';

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<button on:click={handleClick}>
	<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
</button>
