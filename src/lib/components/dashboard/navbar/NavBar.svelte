<!-- Navbar.svelte -->

<script lang="ts">
	import { Cursor, Draw, Eraser, Arrow } from './navbar-icons';
	import { navBarState, keyPress } from '$lib/io/Stores';

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
			index: 0
		}
	];

	const setMode = (event: any, clickedIndex: number) => {
		navBarState.set(event.detail);
		activeIndex = clickedIndex; // set the active index
	};

	// Reactively determine the active button based on the pressed key
	let activeIndex: number | null = null;
	$: if ($keyPress !== null) {
		activeIndex = parseInt($keyPress);
	}
</script>

<div
	class="rounded-md fixed inset-x-0 top-3 z-50 flex h-12 items-center justify-center background shadow-lg"
>
	<div class="flex items-center justify-center space-x-4 ml-1 mr-1">
		{#each icons as { name, component, index } (name)}
			<div
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex ? 'selected' : ''
				}`}
				on:keypress={(event) => {
					if (['0', '1', '2', '3'].includes(event.key)) {
						keyPress.set(event.key);
					}
				}}
				on:click={() => setMode({ detail: name }, index)}
			>
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} on:mode={() => setMode({ detail: name }, index)} />
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
		background-color: #625f7c;
	}
</style>
