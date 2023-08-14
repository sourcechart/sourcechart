<script lang="ts">
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Canvas from '$lib/components/ui/draw/Canvas.svelte';
	import Sidebar from '$lib/components/dashboard/sidebar/Sidebar.svelte';
	import { DarkMode } from '$lib/components/ui';
	import { onMount } from 'svelte';

	import { duckDBInstanceStore } from '$lib/io/Stores';
</script>

<!-- Center this on the screen-->
<div class="flex justify-center items-center mt-3 z-30">
	<DarkMode />
	<NavBar />
</div>
<div class="fixed z-30 ml-1">
	<Sidebar />
</div>

<Canvas />
