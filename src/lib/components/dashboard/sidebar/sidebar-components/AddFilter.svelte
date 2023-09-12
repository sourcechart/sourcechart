<script lang="ts">
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

	let components: { component: any }[] = [];

	const addFilterToSidebar = () => {
		components = [{ component: Filter }, ...components]; // Add new filter to the beginning of the array
	};
</script>

{#each components as { component: Component }}
	<div class="py-2 flex">
		<svelte:component this={Component} />
	</div>
{/each}
<button on:click={addFilterToSidebar} on:keydown={null}>
	<div
		class="flex w-full selectFieldColor items-center justify-between shadow-md text-left px-3 py-1 dark:text-black hover:bg-gray-200"
	>
		Add Filter
		<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
	</div>
</button>

<style>
	.selectFieldColor {
		background-color: #cd9f34;
	}
</style>
