<script lang="ts">
	import { CursorIcon, DrawBoundary } from './navbar-components';
	import NavBarWrapper from './NavBarWrapper.svelte';
	let mode = 'editing'; // Default mode is editin

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
		mode = event.detail;
	};
</script>

<NavBarWrapper>
	{#each components as component (component)}
		<div class="flex items-center justify-between mx-1 rounded-md overflow-hidden">
			<div class="relative flex align-center justify-items-center items-center flex-col">
				<CursorIcon on:mode={setMode} />
				<DrawBoundary on:mode={setMode} />;
			</div>
		</div>
	{/each}
</NavBarWrapper>
