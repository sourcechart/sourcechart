<script lang="ts">
	export let data;
	let { supabase } = data;
	$: ({ supabase } = data);

	let email: string;
	let password: string;

	const handleLogin = async () => {
		await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${location.origin}/auth/callback`
			}
		});
	};
</script>

<!-- Use Tailwind CSS classes for styling -->
<div class="flex justify-center items-center h-screen bg-gray-200">
	<div class="bg-white p-8 rounded-lg shadow-md w-96">
		<img src="logo1.png" alt="Logo" class="mx-auto mb-4 w-52" />
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
					on:click={handleLogin}
				>
					Login
				</button>
			</div>
		</form>
	</div>
</div>
