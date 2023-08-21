<script lang="ts">
	import Dashboard from '$lib/components/dashboard/dashboard/Dashboard.svelte';
	import { setLocalStorage } from '$lib/io/Storage';

	setLocalStorage('color-theme', 'dark');

	export let data;

	const addDataToDatabase = async () => {
		const { error } = await data.supabase.from('users').insert({
			id: data.session?.user.id,
			email: data.session?.user.email,
			session_id: data.session?.user.session_id
		});

		console.log(error);
	};

	$: if (data.session) {
		addDataToDatabase();
	}
</script>

<Dashboard />
```
