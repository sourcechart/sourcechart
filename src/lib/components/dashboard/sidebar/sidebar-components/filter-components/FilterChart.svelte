<script lang="ts">
	import { Chart } from '$lib/components/dashboard/echarts';

	export let frequencies: { [key: number]: number } = {};
	export let startValue;
	export let endValue;
	let options = {};
</script>

<div>
	<Chart {options} renderer={'svg'} />
</div>
