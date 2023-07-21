<script lang="ts">
	import LowCodeSidebarTab from './LowCodeSidebarTab.svelte';
	import WorkFlowSidebar from './WorkFlowSidebar.svelte';
	import FileUpload from './sidebar-components/FileUpload.svelte';
	import { SidebarWrapper } from '$lib/components/ui';
	import { Tabs, TabItem } from 'flowbite-svelte';

	import { clickInside } from '$lib/actions/MouseActions';
	import { activeSidebar } from '$lib/io/Stores';

	const handleClickInside = () => {
		$activeSidebar = true;
	};
</script>

<div use:clickInside={{ clickInside: handleClickInside }} class="space-y-4">
	<SidebarWrapper bind:open={$activeSidebar} id="sidebar">
		<div class="flex flex-col space-y-1">
			<p class="text-xs">Upload Files</p>
			<FileUpload />
		</div>
		<Tabs style="underline" contentClass="">
			<TabItem open title="LowCode">
				<LowCodeSidebarTab />
			</TabItem>
			<TabItem title="Work Flows">
				<WorkFlowSidebar />
			</TabItem>
		</Tabs>
	</SidebarWrapper>
</div>
