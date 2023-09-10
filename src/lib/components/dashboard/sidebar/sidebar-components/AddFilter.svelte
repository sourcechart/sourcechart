<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import Filter from './filter-components/Filter.svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';

	let components: any[] = [];

	const addFilterToSidebar = () => {
		components = [...components, Filter];
	};
</script>

{#each components as Component}
	<div class="py-2">
		<svelte:component this={Component} />
	</div>
{/each}
<Button on:click={addFilterToSidebar}
	>Add Filter
	<PlusSolid class="w-3 h-3 ml-2 text-white dark:text-white" />
</Button>
