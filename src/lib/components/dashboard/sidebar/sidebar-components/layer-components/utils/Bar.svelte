<script lang="ts">
	import { ColorScale, ColorPalletes } from './ColorScale';

	export let k: number = 10;
	export let selectedColorScale: ColorPalletes = ColorPalletes.BLUES; // Default value
	const myColorScales = new ColorScale(k);
	const segments = 10; // Number of segments to divide the color scale into

	$: {
		const foo = myColorScales.getColorFromValue(selectedColorScale, (0 / segments) * 100);
		console.log(foo);
	}
</script>

<div class="color-bar">
	{#each Array(segments).fill(null) as _, index}
		<div
			class="color-segment"
			style="background-color: {myColorScales.getColorFromValue(
				selectedColorScale,
				(index / segments) * 100
			)}"
		/>
	{/each}
</div>

<style>
	.color-bar {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-top: 10px;
	}

	.color-segment {
		width: 10%;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
