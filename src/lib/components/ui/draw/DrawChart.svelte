<script lang="ts">
	import { Layer } from 'svelte-konva';

	export let id: string;
	export let x: number;
	export let y: number;
	let width: number;
	let height: number;
</script>

<Layer>
	<div {id}>
		<!--From here, we are going to loop in the canvas-->
		<slot />
	</div>
</Layer>
