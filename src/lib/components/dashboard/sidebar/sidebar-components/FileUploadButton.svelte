<script lang="ts">
	//@ts-ignore
	import Button from 'flowbite-svelte/Button.svelte';
	import { fileDropdown } from '$lib/io/Stores';
	import { activeDropZone, activeSidebar } from '$lib/io/Stores';

	$: numberOfDatasets = fileDropdown();

	const handleClick = () => {
		activeDropZone.set(true);
		activeSidebar.set(false);
	};
</script>

<Button outline color="light" id="multiple_files" on:click={handleClick}>
	<div class="flex justify-between space-x-2">
		<p class="text-gray-400">Datasets [{$numberOfDatasets.length}]</p>
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
	</div>
</Button>
