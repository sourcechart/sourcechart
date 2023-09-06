<script lang="ts">
	import { Range } from 'flowbite-svelte';
	export let min: number;
	export let max: number;
	let minmaxValue = 5;
</script>

<Range id="range-minmax" min="0" max="10" bind:value={minmaxValue} />
