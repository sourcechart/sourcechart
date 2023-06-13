<script lang="ts">
	import { dropdownStore } from '$lib/io/stores';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id: string;

	let handleClick = () => {
		dispatch('click');
		dropdownStore.toggle(id);
	};
</script>

<button on:click={handleClick}> <slot /> </button>
