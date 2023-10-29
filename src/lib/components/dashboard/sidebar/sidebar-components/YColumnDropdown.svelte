<script lang="ts">
	import { clickedChartIndex, allCharts } from '$lib/io/Stores';
	import Dropdown from './utils/Dropdown.svelte';
	import { getColumnsFromFile } from '$lib/io/Stores';

	$: columns = getColumnsFromFile();
	let currentValue: string | null = '';

	$: i = clickedChartIndex();

	$: if (
		$allCharts.length > 0 &&
		$allCharts[$i] &&
		$allCharts[$i].yColumn !== null &&
		$allCharts[$i].filename !== null &&
		$allCharts[$i].filename !== undefined
	) {
		currentValue = $allCharts[$i].yColumn;

		let yColumnExistsInSchema = $allCharts[$i].schema.some(
			(item: { name: string }) => item.name === currentValue
		);

		if (!yColumnExistsInSchema) {
			currentValue = '';
		}
	} else {
		currentValue = '';
	}

	const handleChoose = (e: CustomEvent) => {
		var column = e.detail.column;
		allCharts.update((charts) => {
			charts[$i].yColumn = column;
			currentValue = column;
			const selectedColumnSchema = $allCharts[$i].schema.find(
				(item: { name: string }) => item.name === column
			);

			if (selectedColumnSchema && selectedColumnSchema.type === 'string') {
				charts[$i].aggregator = 'count'; //@ts-ignore
				if (charts[$i].xColumn) charts[$i].groupbyColumns = [charts[$i].xColumn];
			}
			return charts;
		});
	};
</script>

<Dropdown columnType="y" items={$columns} on:choose={handleChoose} />
