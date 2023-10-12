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

	$: console.log($responsiveType);
</script>

<div class="flex justify-center h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="divide-x divide-neutral-700 flex items-center justify-items-center space-x-2">
		<div
			on:click={() => setMode('select', 1)}
			on:mouseover={() => startHover(1)}
			on:mouseout={endHover}
			on:keypress={null}
			on:blur={null}
			on:focus={null}
			class={`flex items-center  justify-center mx-1 rounded-md overflow-hidden ${
				activeIndex === 1 ? 'bg-[#908bd971]' : 'hover:text-neutral-700/90 hover:bg-neutral-500'
			}`}
		>
			<Cursor />
			{#if showTooltip[1] && $responsiveType !== 'mobile'}
				<div
					role="tooltip"
					class="absolute -bottom-6 left-1/2 z-30 transform -translate-x-1/2 px-1 bg-neutral-200 text-gray-700 text-xs shadow-sm"
				>
					Select Items
				</div>
			{/if}
		</div>

		<div class="flex items-center justify-items-center">
			<!-- Rectangle Icon -->
			<div
				on:click={() => setMode('drawRectangle', 2)}
				on:keypress={null}
				on:mouseover={() => startHover(2)}
				on:mouseout={endHover}
				on:blur={null}
				on:focus={null}
				class={`flex items-center justify-center ml-2 rounded-md overflow-hidden ${
					activeIndex === 2 ? 'bg-[#908bd971]' : 'hover:text-neutral-700/90 hover:bg-neutral-500'
				}`}
			>
				<Rectangle />
				{#if showTooltip[2] && $responsiveType !== 'mobile'}
					<div
						role="tooltip"
						class="absolute -bottom-6 left-1/2 z-30 transform -translate-x-1/2 px-1 bg-neutral-200 text-gray-700 text-xs shadow-sm"
					>
						Draw Rectangle
					</div>
				{/if}
			</div>

			<!-- Arrow Icon -->
			<div
				on:click={() => setMode('drawArrow', 3)}
				on:keypress={null}
				on:mouseover={() => startHover(3)}
				on:mouseout={endHover}
				on:blur={null}
				on:focus={null}
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					activeIndex === 3 ? 'bg-[#908bd971]' : 'hover:text-neutral-700/90 hover:bg-neutral-500'
				}`}
			>
				<Arrow />
				{#if showTooltip[3] && $responsiveType !== 'mobile'}
					<div
						role="tooltip"
						class="absolute -bottom-6 left-1/2 z-30 transform -translate-x-1/2 px-1 bg-neutral-200 text-gray-700 text-xs shadow-sm"
					>
						Draw Arrow
					</div>
				{/if}
			</div>

			<!-- Eraser Icon -->
			<div
				on:click={() => setMode('eraser', 0)}
				on:keypress={null}
				on:mouseover={() => startHover(0)}
				on:mouseout={endHover}
				on:blur={null}
				on:focus={null}
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					activeIndex === 0 ? 'bg-[#908bd971]' : 'hover:text-neutral-700/90 hover:bg-neutral-500'
				}`}
			>
				<Eraser />
				{#if showTooltip[0] && $responsiveType !== 'mobile'}
					<div
						role="tooltip"
						class="absolute -bottom-6 left-1/2 z-30 transform -translate-x-1/2 px-1 bg-neutral-200 text-gray-700 text-xs shadow-sm"
					>
						Erase Canvas
					</div>
				{/if}
			</div>
		</div>
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
