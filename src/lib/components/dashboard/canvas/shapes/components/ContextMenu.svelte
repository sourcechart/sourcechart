<!-- ContextMenu.svelte -->
<script lang="ts">
	export let x: number = 0;
	export let y: number = 0;
	export let show: boolean = false;
	import { createEventDispatcher } from 'svelte';
	let items = ['Export Data', 'Copy Image', 'Save Image As'];

	const dispatch = createEventDispatcher();
	const handleClick = (item: string) => {
		dispatch('select', item);
	};
</script>

<button
	class="context-menu {show ? 'show' : ''}"
	style="top: {y}px; left: {x}px;"
	on:click={(e) => e.stopPropagation()}
>
	{#each items as item}
		<button class="context-menu-item" on:click={() => handleClick(item)}>{item}</button>
	{/each}
</button>

<style>
	.context-menu {
		position: absolute;
		background-color: #fff;
		border: 1px solid #ccc;
		z-index: 1000;
		display: none;
	}
	.context-menu.show {
		display: block;
	}
	.context-menu-item {
		padding: 8px 16px;
		cursor: pointer;
	}
	.context-menu-item:hover {
		background-color: #f5f5f5;
	}
</style>
