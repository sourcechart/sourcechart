<script>
	import Dashboard from '$lib/components/dashboard/dashboard/Dashboard.svelte';
	import GetStarted from '$lib/components/dashboard/documentation/GetStarted.svelte';
	import { setLocalStorage } from '$lib/io/storage';

	setLocalStorage('color-theme', 'dark');
</script>

<Dashboard />
<GetStarted />
