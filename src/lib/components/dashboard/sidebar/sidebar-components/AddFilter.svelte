<script lang="ts">
	//@ts-ignore
	//import Button from 'flowbite-svelte/Button.svelte';
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

	let showDropdown: boolean = false;
	export let addFilterDistance: number = 0;
	let components: { component: any; distance: number }[] = [];

	const addFilterToSidebar = () => {
		components = [...components, { component: Filter, distance: addFilterDistance }];
	};
</script>

{#each components as { component: Component, distance }}
	<div class="py-2">
		<svelte:component this={Component} addFilterDistance={distance} />
	</div>
{/each}

<button on:click={addFilterToSidebar} on:keydown={null}>
	<div
		class="flex w-full selectFieldColor shadow-md text-left px-3 py-1 dark:text-black hover:bg-gray-200"
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
