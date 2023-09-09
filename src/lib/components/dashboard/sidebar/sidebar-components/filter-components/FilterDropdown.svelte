<script lang="ts">
	import { onMount } from 'svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	export let items: any[] = [];
	export let column: string;

	let showDropdown = false;
	let dropdownElement: HTMLElement;
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

	const checkDropdownPosition = () => {
		const viewportHeight = window.innerHeight;
		const dropdownTop = dropdownElement.getBoundingClientRect().top;
		const dropdownHeight = dropdownElement.getBoundingClientRect().height;
		const sidebarBottom =
			document.querySelector('.outerDiv')?.getBoundingClientRect().bottom || viewportHeight;

		if (
			dropdownTop + dropdownHeight > viewportHeight ||
			dropdownTop + dropdownHeight > sidebarBottom
		) {
			dropdownElement.classList.add('dropdown-up');
			dropdownElement.classList.remove('dropdown-down');
		} else {
			dropdownElement.classList.remove('dropdown-up');
			dropdownElement.classList.add('dropdown-down');
		}
	};

	onMount(() => {
		window.addEventListener('resize', checkDropdownPosition);
	});
</script>

<div class="dropdown">
	<button
		on:click={() => {
			showDropdown = !showDropdown;
		}}
		class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
	>
		Choose Field
	</button>
	{#if showDropdown}
		<ul
			bind:this={dropdownElement}
			class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200"
		>
			{#each items as item}
				<li>
					<button
						on:click={() => {
							updateFilter(item);
							showDropdown = false;
							checkDropdownPosition();
						}}
						class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-200"
					>
						{item}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
	}

	.dropdown-up ul {
		bottom: 100%;
		top: auto;
	}

	.dropdown-down ul {
		top: 100%;
	}
</style>
