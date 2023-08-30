<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	export let data;
</script>

<div class="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
	<div
		class="relative px-6 border pb-8 pt-10 shadow-xl round ring-1 ring-gray-900 outline-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
	>
		<img src="logo1.png" alt="Logo" class="mx-auto mb-4 w-48" />
		<Auth
			supabaseClient={data.supabase}
			view="magic_link"
			magicLink={true}
			showLinks={false}
			redirectTo={`${data.url}/auth/callback`}
			providers={['google']}
			appearance={{
				theme: ThemeSupa
			}}
		/>
	</div>
</div>
