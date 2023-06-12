<script>
	import Dashboard from '$lib/components/dashboard/dashboard/Dashboard.svelte';
	import { DarkMode } from "$lib/components/ui"
	import GetStarted from '$lib/components/dashboard/documentation/GetStarted.svelte';
	import { setLocalStorage } from '$lib/io/storage';

	setLocalStorage('color-theme', 'dark');
</script>

<div class="relative">
	<div class="absolute top-0 right-0 mt-4">
		<DarkMode />
	</div>
</div>

<Dashboard />
<GetStarted />
