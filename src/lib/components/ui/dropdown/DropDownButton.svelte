<script lang="ts">
	import { dropdownStore } from '$lib/io/Stores';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id: string;

	let handleClick = () => {
		dispatch('click');
		dropdownStore.toggle(id);
	};
</script>

<button
	id="dropdownDefaultButton"
	data-dropdown-toggle="dropdown"
	class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
	type="button"
	on:click={handleClick}
	><slot />
	<svg
		class="w-4 h-4 ml-2"
		aria-hidden="true"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	/>
</button>
