<script lang="ts">
	import { Cursor, Draw, Eraser } from './navbar-icons';
	import { navBarState } from '$lib/io/Stores';

	let icons = [
		{
			name: 'Cursor',
			component: Cursor
		},
		{
			name: 'Draw',
			component: Draw
		},
		{
			name: 'Eraser',
			component: Eraser
		}
	];

	const setMode = (event: any) => {
		navBarState.set(event.detail);
	};
</script>

<div
	class="rounded-md fixed inset-x-0 top-3 z-50 flex h-12 items-center justify-center background shadow-lg"
>
	<div class="flex items-center justify-between space-x-4 ml-1 mr-1">
		{#each icons as { name, component } (name)}
			<div class="flex items-center justify-between mx-1 rounded-md overflow-hidden">
				<div class="relative flex align-center justify-items-center items-center flex-col">
					<svelte:component this={component} on:mode={setMode} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.background {
		background-color: rgb(35, 34, 34);
	}
</style>
