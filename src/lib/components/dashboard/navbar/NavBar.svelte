<script lang="ts">
	import { Cursor, Draw, Eraser } from './navbar-icons';
	import NavBarWrapper from '$lib/components/dashboard/navbar/NavBarWrapper.svelte';
	import { navBarState, activeSidebar } from '$lib/io/stores';

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
		activeSidebar.set(true);
		navBarState.set(event.detail);
	};
</script>

<NavBarWrapper>
	{#each icons as { name, component } (name)}
		<div class="flex items-center justify-between mx-1 rounded-md overflow-hidden">
			<div class="relative flex align-center justify-items-center items-center flex-col">
				<svelte:component this={component} on:mode={setMode} />
			</div>
		</div>
	{/each}
</NavBarWrapper>
