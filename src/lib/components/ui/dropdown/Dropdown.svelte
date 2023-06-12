<!-- src/lib/DropDown.svelte -->
<script lang="ts">
	let show: boolean = false;

	const toggleDropdown = () => {
		show = !show;
	};
</script>

<div class="dropdown h-4 w-auto">
	<button on:click={toggleDropdown}>
		<slot name="trigger" />
	</button>

	{#if show}
		<div class="dropdown-menu">
			<slot name="items" />
		</div>
	{/if}
</div>

<style>
</style>
