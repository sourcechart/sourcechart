<script lang="ts">
	import { Cursor, Draw } from './navbar-icons';
	import NavBarWrapper from './NavBarWrapper.svelte';
	import { navBarMode } from '$lib/io/stores';

	let components = [
		{
			name: 'CursorIcon',
			component: Cursor
		},
		{
			name: 'DrawBoundary',
			component: Draw
		}
	];

	const setMode = (event: any) => {
		navBarMode.set(event.detail);
	};
</script>

<NavBarWrapper>
	{#each components as { name, component } (name)}
		<div class="flex items-center justify-between mx-1 rounded-md overflow-hidden">
			<div class="relative flex align-center justify-items-center items-center flex-col">
				<svelte:component this={component} on:mode={setMode} />
			</div>
		</div>
	{/each}
</NavBarWrapper>
