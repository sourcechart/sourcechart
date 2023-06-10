<script lang="ts">
	import { activeChart } from '$lib/io/stores';

	export let open: boolean;
	export let id: string = '';

	function handleInside() {
		$activeChart = true;
	}

	function handleOutside(){
		$activeChart=false
	}

</script>

<div
	class={open
		? 'bg-gray-700  text-white w-64 overflow-auto transition-transform duration-200 ease-in-out'
		: '-translate-x-full invisible'}
	{id}
>
		
	<div class="p-6"  >
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

<style>
</style>
