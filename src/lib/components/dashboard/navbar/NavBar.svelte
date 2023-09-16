<!-- Navbar.svelte -->

<script lang="ts">
	import { Cursor, Draw, Eraser, Arrow } from './navbar-icons';
	import { navBarState } from '$lib/io/Stores';

	let icons = [
		{
			name: 'Cursor',
			component: Cursor,
			index: 1
		},
		{
			name: 'Draw',
			component: Draw,
			index: 2
		},
		{
			name: 'Arrow',
			component: Arrow,
			index: 3
		},

		{
			name: 'Eraser',
			component: Eraser,
			index: 4
		}
	];

	const setMode = (event: any) => {
		console.log(event.detail);
		navBarState.set(event.detail);
	};

	$: console.log($navBarState);
</script>

<div
	class="rounded-md fixed inset-x-0 top-3 z-50 flex h-12 items-center justify-center background shadow-lg"
>
	<div class="flex items-center justify-center space-x-4 ml-1 mr-1">
		{#each icons as { name, component } (name)}
			<div class="flex items-center justify-center mx-1 rounded-md overflow-hidden">
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} on:mode={setMode} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.background {
		background-color: rgb(38, 38, 39);
	}
	.selected {
		background-color: #9d99dc;
	}
</style>
