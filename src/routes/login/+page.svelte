<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	export let data;
</script>

<div class="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
	<div
		class="relative px-6 border pb-8 pt-10 shadow-xl round ring-1 ring-gray-900 outline-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
	>
		<Auth
			supabaseClient={data.supabase}
			showLinks={false}
			providers={['google']}
			appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		/>
	</div>
</div>
