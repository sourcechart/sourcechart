<script lang="ts">
	import { setContext } from 'svelte';
	export let isOpen = false;

	const toggleDropdown = () => {
		isOpen = !isOpen;
	};

	type DropdownContext = {
		toggleDropdown: typeof toggleDropdown;
	};

	setContext<DropdownContext>('dropdown', { toggleDropdown });
</script>

{#if isOpen}
	<div
		class="scrollBarDiv bg-neutral-900 rounded-md absolute w-full left-0 top-full mt-1 transform transition-transform origin-top overflow-y-auto overflow-x-hidden z-10"
	>
		<slot />
	</div>
{/if}

<style>
	/* For WebKit (Chrome, Safari) */
	.scrollBarDiv::-webkit-scrollbar {
		width: 4px; /* Change this value to make the scrollbar thinner or thicker */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 2px; /* Adjust the border-radius as per the new width */
	}

	.scrollBarDiv::-webkit-scrollbar-thumb:hover {
		background-color: rgba(168, 168, 168, 0.5);
	}

	/* For Firefox */
	.scrollBarDiv {
		scrollbar-width: thin; /* This property can have values of "none", "auto", "thin", and "wide" */
		scrollbar-color: rgba(40, 40, 40, 0.3) rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
	}
</style>
