<script lang="ts">
	//@ts-ignore
	import Dropdown from 'flowbite-svelte/Dropdown.svelte'; //@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte'; //@ts-ignore
	import DropdownItem from 'flowbite-svelte/DropdownItem.svelte';
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';

	import { onMount } from 'svelte';

	export let items: any[] = [];
	export let column: string;
	let dropdown: HTMLElement;
	let button: HTMLElement;

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
	<Button bind:this={button}>Choose Field</Button>
	<Dropdown>
		{#each items as item}
			<DropdownItem on:click={() => updateFilter(item)}>{item}</DropdownItem>
		{/each}
	</Dropdown>
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
