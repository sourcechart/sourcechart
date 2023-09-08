<script lang="ts">
	//@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore

	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';

	export let items: any[] = [];
</script>

<Button />
<Dropdown>
	{#each items as item}
		<DropdownItem>{item}</DropdownItem>
	{/each}
</Dropdown>
