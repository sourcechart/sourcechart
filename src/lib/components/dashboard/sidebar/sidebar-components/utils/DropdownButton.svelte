<script lang="ts">
	export let columnType: DropdownType;
	export let currentValue: string | null = '';
</script>

<button
	aria-label="Toggle Dropdown"
	class="mx-auto bg-neutral-900 w-full rounded-sm justify-center hover:bg-neutral-900/50 flex-grow flex items-center text-center border-neutral-700/50"
	on:click
>
	<span class="text-sm text-neutral-300 ml-1">{columnType}</span>
	<span class="text-sm text-gray-100 w-full justify-center truncate px-3">
		{currentValue || 'Select a column'}
	</span>
</button>
