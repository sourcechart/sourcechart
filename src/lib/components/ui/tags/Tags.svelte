<script lang="ts">
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/actions/clickUtils';

	export let items: Array<string> = [];
	export let removeItem: (item: string) => void;

	let selectedItem: number | null = null;
	let value: string = '';

	function addValue() {
		if (value !== '') {
			items = [...items, value];
			value = '';
		}
	}

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

	$: console.log(items);
</script>

<div class="flex justify-center items-center">
	<div
		class="flex items-center rounded-full bg-white shadow px-4 py-2 w-64 border border-gray-300 text-base"
	>
		{#each items as item, i (i)}
			<div
				class="mr-2 rounded-full bg-blue-600 text-white px-2 py-1 text-sm cursor-pointer hover:bg-blue-500"
				on:click={() => selectItem(i)}
			>
				{item}
				<div
					class="inline-block ml-2 text-xs cursor-pointer"
					on:click|stopPropagation={() => removeItem(item)}
				>
					x
				</div>
			</div>
		{/each}
	</div>
</div>
