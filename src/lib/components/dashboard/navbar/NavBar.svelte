<!-- Navbar.svelte -->

<script lang="ts">
	import { Cursor, Rectangle, Eraser, Arrow } from './navbar-icons';
	import { navBarState, keyPress, responsiveType } from '$lib/io/Stores';

	let activeIndex: number | null = null;

	let icons: { name: string; mode: NavBar; component: any; index: number; tooltip: string }[] = [
		{
			name: 'Cursor',
			mode: 'select',
			component: Cursor,
			index: 1,
			tooltip: 'Select Items'
		},
		{
			name: 'Rectangle',
			mode: 'drawRectangle',
			component: Rectangle,
			index: 2,
			tooltip: 'Draw Rectangle'
		},
		{
			name: 'Arrow',
			mode: 'drawArrow',
			component: Arrow,
			index: 3,
			tooltip: 'Draw Arrow'
		},
		{
			name: 'Eraser',
			mode: 'eraser',
			component: Eraser,
			index: 0,
			tooltip: 'Erase Canvas'
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

	// Tooltip functionality
	let hoveredIndex: number | null = null;
	let hoverTimeout: NodeJS.Timeout;

	const startHover = (index: number): void => {
		hoveredIndex = index;
		hoverTimeout = setTimeout(() => {
			showTooltip[index] = true;
		}, 500); // Show tooltip after 500ms
	};

	const endHover = (): void => {
		clearTimeout(hoverTimeout);
		showTooltip = {};
		hoveredIndex = null;
	};

	// Tooltip state for each icon
	let showTooltip: { [key: number]: boolean } = {};
</script>

<div class="flex justify-center h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="flex items-center justify-center space-x-3 ml-1 mr-1">
		{#each icons as { name, component, index, mode, tooltip } (name)}
			<div
				class={`flex items-center  justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex
						? 'bg-[#908bd971]'
						: 'hover:text-neutral-700/90 hover:bg-neutral-500'
				}`}
				on:keypress={(event) => {
					if (['0', '1', '2', '3'].includes(event.key)) {
						keyPress.set(event.key);
					}
				}}
				on:click={() => setMode(mode, index)}
				on:mouseover={() => startHover(index)}
				on:mouseout={endHover}
				on:blur={endHover}
				on:focus={() => {
					null;
				}}
			>
				{#if showTooltip[index] && $responsiveType !== 'mobile'}
					<div
						role="tooltip"
						class="absolute -bottom-6 left-1/2 z-30 transform -translate-x-1/2 px-1 bg-neutral-200 text-gray-700 text-xs shadow-sm"
					>
						{tooltip}
					</div>
				{/if}
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} />

					<!-- Tooltip element for each icon -->
				</div>
			</div>
		{/each}
	</div>
</div>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Oxygen+Mono:wght@400;500;700&display=swap"
/>

<style>
	.font {
		font-family: 'Oxygen Mono', monospace;
	}
</style>
