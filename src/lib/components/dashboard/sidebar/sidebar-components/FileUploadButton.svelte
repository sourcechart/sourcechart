<script lang="ts">
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<button on:click={handleClick}>
	<PlusSolid />
</button>
