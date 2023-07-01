<!-- I only put this here so it would be easier to navigate to in the file tree. Could definitely be in /dashboard/+page.svelte-->
<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	//import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import Canvas from '$lib/components/ui/draw/Canvas.svelte';

	import { DarkMode } from '$lib/components/ui';
</script>

<Canvas />

<div class="flex-row items-center">
	<DarkMode />
	<NavBar />
</div>
<!--<Sidebar />-->
