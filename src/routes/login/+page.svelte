<script lang="ts">
	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let email: string;
	let password: string;

	type Provider = 'google';

	const handleSignIn = async () => {
		await supabase.auth.signInWithPassword({
			email,
			password
		});
	};

	const handleSignUp = async () => {
		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`
			}
		});
	};

	const handleOAuthLogin = async (provider: Provider) => {
		const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider });
	};
</script>

<!-- Use Tailwind CSS classes for styling -->
<div class="flex justify-center items-center h-screen bg-gray-200">
	<div class="bg-white p-8 rounded-lg shadow-md w-96">
		<h1 class="text-2xl mb-4">Login</h1>
		<img src="logo1.png" alt="Logo" class="mx-auto mb-4 w-48" />

		<form>
			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-600">Username</label>
				<input
					id="username"
					type="text"
					class="mt-1 p-2 w-full rounded-md border"
					bind:value={email}
				/>
			</div>

			<div class="mb-4">
				<label for="password" class="block text-sm font-medium text-gray-600">Password</label>
				<input
					id="password"
					type="password"
					class="mt-1 p-2 w-full rounded-md border"
					bind:value={password}
				/>
			</div>

			<div>
				<button
					type="submit"
					class="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
				>
					Login
				</button>
			</div>
		</form>
	</div>
</div>
