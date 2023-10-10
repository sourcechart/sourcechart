<script lang="ts">
	export let filetype: string;
</script>

<div class="mb-3 relative w-10 h-10">
	<div class="absolute inset-0 flex justify-start items-center z-10">
		<span class="text-xs text-white bg-gray-400 px-1 mt-5"> {filetype} </span>
	</div>
	<svg class="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2">
			<path
				d="M5 20V4a1 1 0 0 1 1-1h6.172a2 2 0 0 1 1.414.586l4.828 4.828A2 2 0 0 1 19 9.828V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"
			/>
			<path d="M12 3v6a1 1 0 0 0 1 1h6" />
		</g>
	</svg>
</div>
