<!-- Eraser icon by Arthur Shlain from Usefulicons.com -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { navBarState } from '$lib/io/Stores';

	$: mode = $navBarState;
	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('mode', 'eraser');
	};
</script>

<button on:click={handleClick} class={mode === 'eraser' ? 'dark:bg-gray-700' : 'dark:bg-gray-800'}>
	<svg xmlns="http://www.w3.org/2000/svg" width="17" height="19" viewBox="0 0 17 19" fill="none">
		<rect width="17" height="19" fill="rgba(0,0,0,0)" />
		<rect
			id="Rectangle 2"
			x="-0.172069"
			y="-0.646317"
			width="7.27866"
			height="16.6236"
			rx="0.5"
			transform="matrix(-0.890461 -0.455059 0.546323 -0.837574 7.39963 17.2624)"
			stroke="black"
		/>
		<line
			id="Line 1"
			y1="-0.5"
			x2="7.17627"
			y2="-0.5"
			transform="matrix(-0.890461 -0.455059 0.546323 -0.837574 13.5454 8.01562)"
			stroke="black"
		/>
		<g id="Rectangle 3" filter="url(#filter0_d_0_1)">
			<rect x="5" y="18" width="9" height="1" fill="black" />
			<rect x="5.25" y="18.25" width="8.5" height="0.5" stroke="black" stroke-width="0.5" />
		</g>
		<defs>
			<filter
				id="filter0_d_0_1"
				x="1"
				y="18"
				width="17"
				height="9"
				filterUnits="userSpaceOnUse"
				color-interpolation-filters="sRGB"
			>
				<feFlood flood-opacity="0" result="BackgroundImageFix" />
				<feColorMatrix
					in="SourceAlpha"
					type="matrix"
					values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					result="hardAlpha"
				/> <feOffset dy="4" /> <feGaussianBlur stdDeviation="2" />
				<feComposite in2="hardAlpha" operator="out" />
				<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
				<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_0_1" />
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_0_1" result="shape" />
			</filter>
		</defs>
	</svg>
</button>
