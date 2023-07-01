<!-- I only put this here so it would be easier to navigate to in the file tree. Could definitely be in /dashboard/+page.svelte-->
<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import Canvas from '$lib/components/ui/draw/Canvas.svelte';

	import { DarkMode } from '$lib/components/ui';
</script>

<!-- Center this on the screen-->
<div class="flex justify-center mt-3 z-30">
	<div class="flex-row">
		<DarkMode />
		<NavBar />
	</div>
</div>
<div>
	<Canvas />
	<div class="z-30">
		<Sidebar />
	</div>
</div>
