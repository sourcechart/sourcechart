<!-- Handle.svelte -->
<script lang="ts">
	export let cursor = 'nw-resize';
	export let position: { x: number; y: number };

	$: style = `left: ${position.x}px; top: ${position.y}px; position: absolute; width: 10px; height: 10px; background: red; border-radius: 50%; cursor: ${cursor};`;
</script>

<div {style} class="handle" />
