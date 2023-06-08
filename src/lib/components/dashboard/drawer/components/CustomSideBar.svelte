<script lang="ts">
	import { onMount } from 'svelte';
	import { activeChart, clearChartOptions } from '$lib/io/stores';

	export let open:boolean;

	let isShown: boolean = false;

	const toggleSidebar = () => {
		isShown = !isShown;
	};

	onMount(() => {
		document.addEventListener('click', toggleSidebar);
		return () => {
			document.removeEventListener('click', toggleSidebar);
		};
	});
</script>

<div class="sidebar" class:sidebar.hidden={open}>
	<div class="p-6">
		<h1 class="text-2xl mb-4">My Sidebar</h1>
		<div class="mb-2">
			<h2 class="text-xl">Section 1</h2>
			<ul class="pl-2">
				<li>Item 1</li>
				<li>Item 2</li>
			</ul>
		</div>
		<div class="mb-2">
			<h2 class="text-xl">Section 2</h2>
			<ul class="pl-2">
				<li>Item 3</li>
				<li>Item 4</li>
			</ul>
		</div>
	</div>
</div>

<button on:click={toggleSidebar}>Toggle Sidebar</button>

<style>
	.sidebar {
		@apply absolute bg-gray-700 text-white w-64 h-full overflow-auto transition-transform duration-200 ease-in-out;
	}
	.sidebar.hidden {
		@apply -translate-x-full;
	}
</style>
