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
	<svg x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
		<rect x="5" y="5" width="20" height="20" fill="rgba(0,0,0,0)" stroke="black" />
	</svg>
</button>
