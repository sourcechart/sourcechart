<script lang="ts">
	//@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	import { onMount } from 'svelte';

	export let items: any[] = [];
	export let column: string;
	let dropdown: HTMLElement;
	let button: HTMLElement;
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

	onMount(() => {
		const checkDropdownPosition = () => {
			const sidebarBottom = document.querySelector('.outerDiv').getBoundingClientRect().bottom;

			const dropdownBottom = dropdown.getBoundingClientRect().bottom;

			console.log(sidebarBottom, dropdownBottom);
			if (dropdownBottom > sidebarBottom) {
				dropdown.classList.add('dropdown-up');
			} else {
				dropdown.classList.remove('dropdown-up');
			}
		};

		button.addEventListener('click', checkDropdownPosition);
	});
</script>

<div bind:this={dropdown} class="dropdown">
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
