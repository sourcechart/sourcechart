<script lang="ts">
	import LowCodeSidebarTab from './LowCodeSidebarTab.svelte';
	import FileUploadButton from './sidebar-components/FileUploadButton.svelte'; //@ts-ignore
	import Tabs from 'flowbite-svelte/Tabs.svelte'; //@ts-ignore
	import TabItem from 'flowbite-svelte/TabItem.svelte'; //@ts-ignore
	import { DatasetDropDown } from './sidebar-components';
	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar, allCharts, mostRecentChartID } from '$lib/io/Stores'; //@ts-ignore
	import Label from 'flowbite-svelte/Label.svelte';

	//@ts-ignore
	export let data;

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

<div use:clickInside={{ clickInside: handleClickInside }} class="space-y-4 overflow-y-auto">
	<div
		class={$activeSidebar
			? 'bg-gray-800 text-white w-64 overflow-auto transition-transform duration-200 ease-in-out rounded-md border-red-50'
			: '-translate-x-full invisible'}
	>
		<div class="p-6">
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
			{#if data.session.user.email == 'noreply@gmail.com'}
				<Tabs style="underline" contentClass="">
					<TabItem open title="LowCode" on:click={clickBasicTab}>
						<LowCodeSidebarTab />
					</TabItem>
					<TabItem title="Work Flows" on:click={clickClusterTab}>
						<!--	<WorkflowSidebar /> -->
					</TabItem>
				</Tabs>
			{:else}
				<LowCodeSidebarTab />
			{/if}
		</div>
	</div>
</div>
