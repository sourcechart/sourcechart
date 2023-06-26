<script lang="ts">
	import { Stage, Layer, Rect } from 'svelte-konva';

	let width: number;
	let height: number;
	function handleClick(e) {
		const konvaEvent = e.detail;
		alert(`Clicked on rectangle: ${konvaEvent.type}`);
	}
</script>

<Stage config={{ width: width, height: height }}>
	<Layer>
		<Rect
			config={{ x: 100, y: 100, width: 400, height: 200,  stroke='red' }}
			on:pointerclick={handleClick}
		/>
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
