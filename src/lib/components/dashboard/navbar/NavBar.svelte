<!-- Navbar.svelte -->

<script lang="ts">
	import { Cursor, Rectangle, Eraser, Arrow } from './navbar-icons';
	import { navBarState, keyPress } from '$lib/io/Stores';
	let activeIndex: number | null = null;

	let icons: { name: string; mode: NavBar; component: any; index: number }[] = [
		{
			name: 'Cursor',
			mode: 'select',
			component: Cursor,
			index: 1
		},
		{
			name: 'Rectangle',
			mode: 'drawRectangle',
			component: Rectangle,
			index: 2
		},
		{
			name: 'Arrow',
			mode: 'drawArrow',
			component: Arrow,
			index: 3
		},
		{
			name: 'Eraser',
			mode: 'eraser',
			component: Eraser,
			index: 0
		}
	];

	const setMode = (mode: NavBar, clickedIndex: number) => {
		navBarState.set(mode);
		activeIndex = clickedIndex;
	};

	$: if ($keyPress !== null) {
		activeIndex = parseInt($keyPress);
	}

	$: {
		const selectedIcon = icons.find((icon) => icon.mode === $navBarState);
		activeIndex = selectedIcon ? selectedIcon.index : null;
	}

	$: if (activeIndex !== null) {
		const selectedIcon = icons.find((icon) => icon.index === activeIndex);
		if (selectedIcon) {
			navBarState.set(selectedIcon.mode);
		}
	}
</script>

<div class="flex justify-center h-10 w-52 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="flex items-center justify-center space-x-4 ml-1 mr-1">
		{#each icons as { name, component, index, mode } (name)}
			<div
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex ? 'selected' : ''
				}`}
				on:keypress={(event) => {
					if (['0', '1', '2', '3'].includes(event.key)) {
						keyPress.set(event.key);
					}
				}}
				on:click={() => setMode(mode, index)}
			>
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.selected {
		background-color: #9d99dc77;
	}
</style>
