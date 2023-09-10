<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

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
<Button on:click={addFilterToSidebar}>
	Add Filter
	<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
</Button>
