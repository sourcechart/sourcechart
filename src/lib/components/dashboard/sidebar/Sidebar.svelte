<script lang="ts">
	import LowCodeSidebarTab from './LowCodeSidebarTab.svelte';
	import FileUploadButton from './sidebar-components/FileUploadButton.svelte';
	//import Tabs from 'flowbite-svelte/Tabs.svelte'; //@ts-ignore
	//import TabItem from 'flowbite-svelte/TabItem.svelte';
	//import Aggregator from './sidebar-components/Aggregator.svelte';
	//import WorkFlowSidebar from './WorkFlowSidebar.svelte';

	import { SidebarWrapper } from '$lib/components/ui'; //@ts-ignore
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar, allCharts, mostRecentChartID } from '$lib/io/Stores'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';

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
			<FileUploadButton />
		</div>
		<div class="flex flex-col space-y-1">
			<Label class="space-y-2 mb-1">
				<span>Choose Dataset</span>
			</Label>
			<DatasetDropDown />
		</div>
		<LowCodeSidebarTab />
		<!--
		<Tabs style="underline" contentClass="">
			<TabItem open title="LowCode" on:click={clickBasicTab}>
			</TabItem>
			<TabItem title="Work Flows" on:click={clickClusterTab}>
				<WorkFlowSidebar />
			</TabItem>
			
		</Tabs>
		-->
	</SidebarWrapper>
</div>
