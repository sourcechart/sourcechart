<script lang="ts">
	import { setLocalStorage } from '$lib/io/Storage';
	import Dashboard from '$lib/components/dashboard/dashboard/Dashboard.svelte';

	setLocalStorage('color-theme', 'dark');
	export let data;
	console.log(data);
</script>

<Dashboard />
```
