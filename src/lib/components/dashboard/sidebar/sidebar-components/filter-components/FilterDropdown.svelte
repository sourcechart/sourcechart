<script lang="ts">
	//@ts-ignore
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	export let items: any[] = [];
	export let column: string;

	let showDropdown = false;

	$: i = clickedChartIndex();

	function updateFilter(item: string) {
		const existingFilter = $allCharts[$i].filterColumns.find((filter) => filter.column === column);

		if (existingFilter) {
			$allCharts[$i].filterColumns.find((filter) => filter.column === column).value = {
				item: item
			};
		} else {
			$allCharts[$i].filterColumns = [
				...$allCharts[$i].filterColumns,
				{
					column: column,
					value: { item: item }
				}
			];
		}
	}
</script>

<div>
	<button
		on:click={() => {
			showDropdown = !showDropdown;
		}}>Choose Field</button
	>
	{#if showDropdown}
		{#each items as item}
			<li>
				<button
					on:click={() => {
						updateFilter(item);
						showDropdown = false;
					}}
					>{item}
				</button>
			</li>
		{/each}
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
	}

	.dropdown-up {
		bottom: 100%;
	}

	.dropdown-down {
		top: 100%;
	}
</style>
