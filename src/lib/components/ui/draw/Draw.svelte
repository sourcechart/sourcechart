<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import { mouseTracker } from '$lib/actions/clickActions';

	function handleMove(x, y) {
		console.log('Mouse moved');

		console.log(x, y);
		// do something with the mouse coordinates
	}
</script>

<div use:mouseTracker={{ onMove: handleMove }} class="container" />

<style>
	.container {
		height: 100vh;
		width: 100vw;
	}
</style>
