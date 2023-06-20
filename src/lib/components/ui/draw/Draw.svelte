<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import {
		mouseMove,
		touchStart,
		touchMove,
		trackMouseState,
		onMouseLeave
	} from '$lib/actions/mouseActions';

	function trackState(x, y) {
		console.log('track state happening ', x, y);
	}

	function handleDrag(x, y) {
		console.log('drag happening ', x, y);
	}

	function handleTouch(x, y) {
		console.log('drag started ', x, y);
	}

	function handleMove(x, y) {
		console.log('Mouse moved');

		console.log(x, y);
		// do something with the mouse coordinates
	}
	function handleLeave() {
		console.log('left');
	}
</script>

<div
	use:trackMouseState
	use:touchMove={{ onMove: handleDrag }}
	use:touchStart={{ onStart: handleTouch }}
	use:mouseMove={{ onMove: handleMove }}
	use:onMouseLeave={{ onLeave: handleLeave }}
	class="container"
/>

<style>
	.container {
		height: 100vh;
		width: 100vw;
	}
</style>
