<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { activeDropZone } from '$lib/io/Stores';
</script>

<Button
	id="multiple_files"
	color="dark"
	on:click={() => {
		activeDropZone.set(true);
	}}
>
	<div class="flex justify-between space-x-2">
		<svg
			class="text-gray-800 dark:text-white"
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
		<p>Add Data</p>
	</div>
</Button>
