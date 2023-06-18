<!-- Eraser icon by Arthur Shlain from Usefulicons.com -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { navBarMode } from '$lib/io/stores';

	$: mode = $navBarMode;
	const dispatch = createEventDispatcher();

	function clickBoundary() {
		dispatch('mode', 'eraser');
	}
</script>

<button
	on:click={clickBoundary}
	class={mode === 'eraser' ? 'dark:bg-gray-600' : 'dark:bg-gray-700'}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		xml:space="preserve"
		version="1.1"
		x="0px"
		y="0px"
		width="30"
		height="30"
		viewBox="0 0 30 30"
		><path
			d="M89.253,12.372C88.342,10.897,86.732,10,85,10L50,10C48.106,10,46.375,11.07,45.528,12.764L10.528,82.764C9.753,84.314,9.836,86.155,10.747,87.628C11.658,89.103,13.268,90,15,90L50,90C51.894,90,53.625,88.93,54.472,87.236L89.472,17.236C90.247,15.686,90.164,13.845,89.253,12.372ZM50,85L15,85L32.5,50L67.5,50L50,85Z"
			stroke="black"
			fill="rgba(0,0,0,0)"
		/></svg
	>
</button>
