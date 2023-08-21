<script lang="ts">
	import Dashboard from '$lib/components/dashboard/dashboard/Dashboard.svelte';
	import { setLocalStorage } from '$lib/io/Storage';

	setLocalStorage('color-theme', 'dark');
	export let data;

	console.log(data);
</script>

<Dashboard />
```
