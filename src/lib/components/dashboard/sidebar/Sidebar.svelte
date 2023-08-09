<script lang="ts">
	import LowCodeSidebarTab from './LowCodeSidebarTab.svelte';
	import WorkFlowSidebar from './WorkFlowSidebar.svelte';
	import FileUpload from './sidebar-components/FileUpload.svelte';
	import { SidebarWrapper } from '$lib/components/ui';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar, allCharts, mostRecentChartID } from '$lib/io/Stores';
	import { Label } from 'flowbite-svelte';

	const handleClickInside = () => {
		$activeSidebar = true;
	};

	function clickClusterTab() {
		allCharts.update((charts) => {
			charts.forEach((chart) => {
				if (chart.chartID === $mostRecentChartID) {
					chart.workflow = 'cluster';
				}
			});
			return charts;
		});
	}

	function clickBasicTab() {
		allCharts.update((charts) => {
			charts.forEach((chart) => {
				if (chart.chartID === $mostRecentChartID) {
					chart.workflow = 'basic';
				}
			});
			return charts;
		});
	}
</script>

<div use:clickInside={{ clickInside: handleClickInside }} class="space-y-4">
	<SidebarWrapper bind:open={$activeSidebar} id="sidebar">
		<div class="flex flex-col space-y-1 mt-2 mb-2">
			<Label class="space-y-2 mb-1">
				<span>Upload Files</span>
			</Label>
			<FileUpload />
		</div>
		<div class="flex flex-col space-y-1">
			<Label class="space-y-2 mb-1">
				<span>Choose Dataset</span>
			</Label>
			<DatasetDropDown />
		</div>
		<Tabs style="underline" contentClass="">
			<TabItem open title="LowCode" on:click={clickBasicTab}>
				<LowCodeSidebarTab />
			</TabItem>
			<TabItem title="Work Flows" on:click={clickClusterTab}>
				<WorkFlowSidebar />
			</TabItem>
		</Tabs>
	</SidebarWrapper>
</div>
