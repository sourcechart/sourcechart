<!-- DropdownButton.svelte -->

<script lang="ts">
	import { getContext } from 'svelte';

	const context = getContext<DropdownContext>('dropdown');

	if (!context) {
		throw new Error('DropdownButton must be used within a Dropdown component');
	}
</script>

<button on:click={context.toggleDropdown} class={$$props.class}>
	<slot />
</button>
