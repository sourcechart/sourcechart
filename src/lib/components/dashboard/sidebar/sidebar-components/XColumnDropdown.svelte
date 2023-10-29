<script lang="ts">
	import { clickedChartIndex, allCharts } from '$lib/io/Stores';
	import ColumnDropdown from './utils/ColumnDropdown.svelte';

	let currentValue: string | null = '';

	$: i = clickedChartIndex();

	$: if (
		$allCharts.length > 0 &&
		$allCharts[$i] &&
		$allCharts[$i].xColumn !== null &&
		$allCharts[$i].filename !== null &&
		$allCharts[$i].filename !== undefined
	) {
		currentValue = $allCharts[$i].xColumn;

		// Check if xColumn value exists in schema's name
		let xColumnExistsInSchema = $allCharts[$i].schema.some(
			(item: { name: string }) => item.name === currentValue
		);

		if (!xColumnExistsInSchema) {
			currentValue = '';
		}
	} else {
		currentValue = '';
	}

	const handleChoose = (e: CustomEvent) => {
		var column = e.detail.column;
		allCharts.update((charts) => {
			charts[$i].xColumn = column;
			currentValue = column;

			const selectedColumnSchema = charts[$i].schema.find(
				(item: { name: string }) => item.name === column
			);

			if (selectedColumnSchema && selectedColumnSchema.type === 'string') {
				charts[$i].aggregator = 'count'; //@ts-ignore
				if (charts[$i].yColumn) charts[$i].groupbyColumns = [charts[$i].yColumn];
			}
			return charts;
		});
	};
</script>

<ColumnDropdown columnType="x" on:choose={handleChoose} class="top-0" />
