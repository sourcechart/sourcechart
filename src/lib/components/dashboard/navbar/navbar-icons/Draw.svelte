<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { navBarState } from '$lib/io/stores';

	$: mode = $navBarState;
	const dispatch = createEventDispatcher();

	function clickBoundary() {
		dispatch('mode', 'drawRectangle');
	}
</script>

<button
	on:click={clickBoundary}
	class={mode === 'drawRectangle' ? 'dark:bg-gray-600' : 'dark:bg-gray-700'}
>
	<svg x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
		<rect x="5" y="5" width="20" height="20" fill="rgba(0,0,0,0)" stroke="black" />
	</svg>
</button>
