<script lang="ts">
	import { Chart } from 'svelte-echarts';

	export let id: string;
	export let options: any;
</script>

<div class="flex absolute container justify-center" {id}>
	<Chart {options} />
</div>

<style>
	.container {
		width: 400px;
		height: 400px;
	}
</style>
