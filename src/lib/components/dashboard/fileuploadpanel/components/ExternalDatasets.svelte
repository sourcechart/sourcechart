<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	let datasets: ExternalDataset[] = [
		{
			name: 'ElectionList',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of All Elections since 1950'
		},
		{
			name: 'Leader List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/election_list_8_21.csv',
			description: 'List of All Leaders Since 1950'
		},
		{
			name: 'Regime List',
			url: 'https://raw.githubusercontent.com/sourcechart/publicdata/main/datasets/regime_list.csv',
			description: 'List of All regimes'
		}
	];
</script>

<Table>
	<TableHead>
		<TableHeadCell>Dataset</TableHeadCell>
		<TableHeadCell>Description</TableHeadCell>
		<TableHeadCell />
	</TableHead>
</Table>
<TableBody class="divide-y">
	<TableBodyRow>
		{#each datasets as dataset}
			<TableBodyCell>{dataset.name}</TableBodyCell>
			<TableBodyCell>{dataset.description}</TableBodyCell>
			<TableBodyCell>
				<p>
					{dataset}
				</p>
			</TableBodyCell>
		{/each}
	</TableBodyRow>
</TableBody>
