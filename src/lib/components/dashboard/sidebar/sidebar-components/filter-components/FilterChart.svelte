<script lang="ts">
	import { Chart } from '$lib/components/dashboard/echarts';

	export let frequencies: { [key: number]: number } = {};
	console.log(frequencies);
	let options = {};
</script>

<div>
	<Chart {options} renderer={'svg'} />
</div>
