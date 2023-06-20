<!-- This module contains the canvas elements for each rectangle-->

<script lang="ts">
	import {
		mouseMove,
		touchStart,
		touchMove,
		trackMouseState,
		onMouseLeave
	} from '$lib/actions/mouseActions';
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
