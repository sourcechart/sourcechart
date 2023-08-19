<script lang="ts">
	import '../app.postcss';
	import 'flowbite/dist/flowbite.css';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	//@ts-ignore
	let { supabase, session } = data; //@ts-ignore

	$: ({ supabase, session } = data);

	onMount(() => {
		//@ts-ignore
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class="container" style="padding: 50px 0 100px 0">
	<slot />
</div>
