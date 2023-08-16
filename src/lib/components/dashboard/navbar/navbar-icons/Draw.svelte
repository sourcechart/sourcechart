<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { navBarState } from '$lib/io/Stores';

	$: mode = $navBarState;
	const dispatch = createEventDispatcher();

	function clickButton() {
		dispatch('mode', 'drawRectangle');
	}
</script>

<button
	on:click={clickButton}
	class={mode === 'drawRectangle' ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}
>
	<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
		><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/><g id="SVGRepo_iconCarrier">
			<rect
				x="4"
				y="4"
				width="16"
				height="16"
				rx="2"
				stroke="#ffffff"
				stroke-width="1"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g></svg
	>
</button>
