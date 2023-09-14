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
	class=" w-8 h-8 flex flex-col justify-center items-center {mode === 'drawRectangle'
		? 'button select'
		: 'dark:bg-gray-800'}"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 448 512"
		fill="#9CA3AF"
	>
		<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
		<path
			d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
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
