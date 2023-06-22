<script lang="ts">
	export let position = {};
	export let cursor: string;
</script>

<div
	style={`width: 10px; height: 10px; background-color: red; position: absolute; cursor: ${cursor}; ${Object.entries(
		position
	)
		.map(([key, value]) => `${key}: ${value};`)
		.join(' ')}`}
/>
