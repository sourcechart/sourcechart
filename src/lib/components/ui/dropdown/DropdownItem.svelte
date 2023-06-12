<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick(e: Event) {
		e.stopPropagation();
		dispatch('click');
	}
</script>

<div class="relative justify-center justify-items-center" on:click={handleClick}>
	<slot />
</div>
