<script lang="ts">
	import { onMount } from 'svelte';
	import { clickOutside } from '$lib/actions/clickUtils';

	export let items: Array<string | number> = [];
	let value: string = '';
	let selectedItem: number | null = null;

	function addValue() {
		if (value !== '') {
			items = [...items, value];
			value = '';
		}
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}

	function selectItem(index: number) {
		selectedItem = index;
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
				removeItem(selectedItem);
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
		use:clickOutside={{ exclude: document.querySelector('.pill') }}
		on:click_outside={() => (selectedItem = null)}
	>
		{#each items as item, i (i)}
			<div
				class="mr-2 rounded-full px-2 py-1 text-sm cursor-pointer pill {selectedItem === i
					? 'bg-blue-500 text-white'
					: 'bg-blue-600 text-white hover:bg-blue-500'}"
				on:click={(e) => {
					e.stopPropagation();
					selectItem(i);
				}}
			>
				{item}
			</div>
		{/each}
		<input
			class={items.length > 0
				? 'text-transparent bg-transparent border-0 focus:outline-none focus:ring-0'
				: 'flex-1 bg-white text-gray-700 border-0 focus:outline-none focus:ring-0'}
			type="text"
			placeholder={items.length > 0 ? '' : 'Add item...'}
			bind:value
			on:keydown={(e) => e.key === 'Enter' && addValue()}
		/>
	</div>
</div>
