<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { navBarState } from '$lib/io/Stores';

	$: mode = $navBarState;
	const dispatch = createEventDispatcher();

	function clickButton() {
		dispatch('mode', 'drawArrow');
	}

	$: console.log($navBarState);
</script>

<button
	on:click={clickButton}
	class=" w-8 h-8 flex flex-col justify-center items-center {mode === 'drawArrow'
		? 'button select'
		: 'dark:bg-gray-800'}"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...$$props}
		><path
			fill="none"
			stroke="#9CA3AF"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="1.5"
			d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
		/></svg
	>
</button>

<style>
	.button {
		border-radius: 0.375rem;
	}
	.select {
		background-color: #9d99dc77;
	}
</style>
