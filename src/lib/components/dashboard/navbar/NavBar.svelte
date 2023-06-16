<script lang="ts">
	import { CursorIcon, DrawBoundary } from './navbar-components';
	import NavBarWrapper from './NavBarWrapper.svelte';
	import { navBarMode } from '$lib/io/stores';

	let components = [
		{
			name: 'CursorIcon',
			component: CursorIcon
		},
		{
			name: 'DrawBoundary',
			component: DrawBoundary
		}
	];

	const setMode = (event: any) => {
		console.log(event.detail);
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
