<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<Button outline color="light" id="multiple_files" on:click={handleClick}>
	<div class="flex justify-between space-x-2">
		<svg
			class="text-gray-700 dark:text-gray-400"
			x="0px"
			y="0px"
			width="18"
			height="18"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 18"
		>
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 1v16M1 9h16"
			/>
		</svg>
		<p class="text-gray-400">Add Data</p>
	</div>
</Button>
