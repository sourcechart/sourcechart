<script lang="ts">
	let isOpen: boolean = false;

	const toggleDropdown = () => {
		isOpen = !isOpen;
	};
</script>

<div class="dropdown relative">
	<button
		class="bg-blue-500 text-white font-semibold py-2 px-4 rounded inline-flex items-center"
		on:click={toggleDropdown}
	>
		<span class="mr-1">Dropdown</span>
		<svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
			><path d="M10 12a2 2 0 110-4 2 2 0 010 4z" /></svg
		>
	</button>

	<div
		class="dropdown-content absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
		class:hidden={isOpen}
	>
		<slot />
	</div>
</div>

<style>
	.dropdown-content {
		display: none;
		position: absolute;
		min-width: 160px;
		z-index: 1;
	}

	.dropdown:hover .dropdown-content {
		display: block;
	}
</style>
