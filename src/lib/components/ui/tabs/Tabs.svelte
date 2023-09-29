<script lang="ts">
	type TabItem = {
		title: string;
		value: number;
		component: any; // Specify a more precise type if possible
	};

	export let items: TabItem[] = [];
	export let activeTabValue: number = 1;

	const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);
	const handleKeyPress = (e: KeyboardEvent, tabValue: number) => {
		if (e.key === 'Enter') handleClick(tabValue)();
	};
</script>

<ul class="flex flex-wrap list-none">
	{#each items as item}
		<li>
			<span
				class={`tab ${activeTabValue === item.value ? 'tab-active' : ''}`}
				on:click={handleClick(item.value)}
				on:keypress={(e) => handleKeyPress(e, item.value)}
				role="tab"
				tabindex="0"
			>
				{item.title}
			</span>
		</li>
	{/each}
</ul>

{#each items as item}
	{#if activeTabValue == item.value}
		<div class="mb-2.5 p-10 rounded-b-md">
			<svelte:component this={item.component} />
		</div>
	{/if}
{/each}

<style>
	.tab {
		padding: 0.5rem 1rem;
		cursor: pointer;
		border-radius: 0.375rem 0.375rem 0 0;
		border: 1px solid transparent;
		transition: all 0.3s ease-in-out;
	}
	.tab:hover {
		border-color: #e5e7eb; /* gray-300 */
	}
	.tab-active {
		background-color: #ffffff; /* bg-white */
		color: #4b5563; /* text-gray-700 */
		border-color: #e5e7eb; /* border-gray-300 */
		border-bottom: 0;
	}
</style>
