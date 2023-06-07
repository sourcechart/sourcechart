<script>
	import NavBar from '$lib/components/dashboard/navbar/NavBar.svelte';
	import Dashboard from '$lib/components/dashboard/dashboard/dashboard.svelte';
	import { DarkMode } from 'flowbite-svelte';
	import GetStarted from '$lib/components/dashboard/documentation/GetStarted.svelte';
	import { setLocalStorage } from '$lib/io/storage';

	setLocalStorage('color-theme', 'dark');
</script>

<div class="relative">
	<div class="absolute top-0 right-0 mt-4">
		<DarkMode />
	</div>
</div>
<div class="flex justify-center">
	<NavBar />
</div>
<Dashboard />
<GetStarted />