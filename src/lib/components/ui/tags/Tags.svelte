<script lang="ts">
	let value: string = '';
	let items: Array<string | number> = [];

	function addValue() {
		if (value !== '') {
			items = [...items, value];
			value = '';
		}
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}
</script>

<div class="flex justify-center items-center h-screen bg-gray-100">
	<div
		class="flex items-center rounded-full bg-white shadow px-4 py-2 w-64 border border-gray-300 text-base"
	>
		{#each items as item, i (i)}
			<div class="mr-2 bg-blue-600 text-white rounded-full px-2 py-1 text-sm">{item}</div>
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

<style>
	@import 'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.1.2/tailwind.min.css';
</style>
