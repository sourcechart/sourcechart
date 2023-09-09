<script lang="ts">
	import { Chart } from '$lib/components/dashboard/echarts';

	export let frequencies: { [key: number]: number } = {}; //@ts-ignore

	let options: any = {
		xAxis: {
			type: 'category',
			data: Object.keys(frequencies),
			show: false // Hide the y-axis
		},
		yAxis: {
			type: 'value',
			show: false // Hide the y-axis
		},
		series: [
			{
				data: Object.values(frequencies),
				type: 'bar'
			}
		]
	};
</script>

<div class="chart">
	<Chart {options} renderer={'svg'} />
</div>

<style>
	.chart {
		width: 100%;
		height: 100px;
	}
</style>
