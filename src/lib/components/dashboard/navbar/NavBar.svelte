<script lang="ts">
	import { CursorIcon, DrawBoundary } from './navbar-components';
</script>

<NavBarWrapper>
	{#each components as component (component)}
		<div
			class="flex items-center justify-between mx-1 rounded-md overflow-hidden dark:hover:bg-gray-600"
		>
			<div
				class="relative flex align-center justify-items-center items-center flex-col dark:hover:bg-gray-600"
			>
				<svelte:component this={component.component} />
			</div>
		</div>
	{/each}
</NavBarWrapper>
