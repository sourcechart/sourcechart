<script>
</script>

<div class="flex justify-center h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class="flex items-center justify-center space-x-3 ml-1 mr-1">
		<!--
		{#each icons as { name, component, index, mode } (name)}
			<div
				class={`flex items-center justify-center mx-1 rounded-md overflow-hidden ${
					index === activeIndex ? 'selected' : ''
				}`}
				on:keypress={(event) => {
					if (['0', '1', '2', '3'].includes(event.key)) {
						keyPress.set(event.key);
					}
				}}
				on:click={() => setMode(mode, index)}
			>
				<div class="relative flex flex-row justify-items-center">
					<svelte:component this={component} />
				</div>
			</div>
		{/each}
        -->
	</div>
</div>
