<script lang="ts">
	import { onMount } from 'svelte';

	export let items: Array<string> = [];
	export let removeItem: (item: string) => void;

	let selectedItem: number | null = null;
	let value: string = '';

	function selectItem(index: number) {
		removeItem(items[index]);
	}

	onMount(() => {
		const handleClickOutside = () => {
			selectedItem = null;
		};
		document.addEventListener('click', handleClickOutside);

		const handleKeyDown = (event: KeyboardEvent) => {
			if (
				(event.key === 'Escape' || event.key === 'Backspace' || event.key === 'Delete') &&
				selectedItem !== null
			) {
				removeItem(items[selectedItem]);
				selectedItem = null;
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div class="flex justify-center items-center">
	<div
		class="flex items-center rounded-full bg-white shadow px-4 py-2 w-64 border border-gray-300 text-base"
	>
		{#each items as item, i (i)}
			<div
				role="button"
				class="mr-2 rounded-full bg-blue-600 text-white px-2 py-1 text-sm cursor-pointer hover:bg-blue-500"
				tabindex="0"
				on:click={() => selectItem(i)}
				on:keydown={(e) => {
					if (e.key === 'Enter') selectItem(i);
				}}
			>
				{item}
				<div
					role="button"
					class="inline-block ml-2 text-xs cursor-pointer"
					tabindex="0"
					on:click|stopPropagation={() => removeItem(item)}
					on:keydown|stopPropagation={(e) => {
						if (e.key === 'Enter') removeItem(item);
					}}
				>
					x
				</div>
			</div>
		{/each}
	</div>
</div>
