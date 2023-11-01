<!-- DropdownItem.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let item: string;

	const dispatch = createEventDispatcher();
</script>

<button
	class="block w-full text-left px-3 py-2 text-gray-300 hover:bg-neutral-700 font-thin text-sm truncate"
	on:click
>
	{item}
</button>
