<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Stage, Layer, Rect } from 'svelte-konva';

	let width: number;
	let height: number;
	let rectangles = [
		{ x: 20, y: 20, width: 100, height: 100 },
		{ x: 150, y: 20, width: 100, height: 100 }
		// Add more rectangle specifications here...
	];
</script>

<Stage config={{ width: width, height: height }}>
	<Layer>
		{#each rectangles as rect}
			<Rect
				config={{
					draggable: true,
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height,
					stroke: 'red'
				}}
			/>
		{/each}
	</Layer>
</Stage>
<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
