<script lang="ts">
	import LowCodeSidebarTab from './LowCodeSidebarTab.svelte';
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
		<Tabs style="underline" defaultClass="" contentClass="">
			<TabItem open>
				<LowCodeSidebarTab />
			</TabItem>
		</Tabs>
	</SidebarWrapper>
</div>
