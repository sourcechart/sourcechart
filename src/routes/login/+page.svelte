<!-- // src/routes/login/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	import GenericLoginButton from '$lib/components/landing/signin/auth/GenericLoginButton.svelte';
	export let form;
</script>

<GenericLoginButton label={'Login'} />
<form method="post" use:enhance>
	<input name="email" value={form?.email ?? ''} />
	<input type="password" name="password" />
	<button>Sign up</button>
</form>
