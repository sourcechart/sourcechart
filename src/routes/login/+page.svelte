<script lang="ts">
	import GoogleSignInButton from '$lib/components/landing/signin/auth/GoogleSignInButton.svelte';
</script>

<div class="relative flex min-h-screen flex-col justify-center overflow-hidden py-6 sm:py-12">
	<div
		class="relative bg-white px-6 border pb-8 pt-10 shadow-xl round ring-1 ring-gray-900 outline-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
	>
		<div class="mx-auto max-w-md">
			<h1>Login</h1>
			<div class="w-full max-w-xs m-auto rounded p-5">
				<GoogleSignInButton />
				<div class="inline-flex items-center justify-center w-full">
					<hr class="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
					<span
						class="absolute px-2 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"
						>or</span
					>
				</div>

				<form>
					<div>
						<label class="block mb-2 outline-1" for="username">Username</label>
						<input
							class="w-full p-2 mb-6 border outline-gray-400 outline-1 rounded-md focus:bg-gray-300"
							type="text"
							name="username"
						/>
					</div>
					<div>
						<label class="block mb-2" for="password">Password</label>
						<input
							class="w-full p-2 mb-6 border outline-1 rounded-md focus:bg-gray-300"
							type="text"
							name="username"
						/>
					</div>
					<div>
						<input
							class="w-full hover:bg-gray-400 bg-gray-300 text-gray-500 font-bold py-2 px-4 mb-6 rounded"
							type="submit"
						/>
					</div>
				</form>
				<footer>
					<a class="hover:text-blue-300 text-blue-500 text-sm float-right" href="/signup"
						>Create Account</a
					>
					<a class="hover:text-blue-300 text-blue-500 text-sm float-left" href="/forgot-password"
						>Forgot Password?</a
					>
				</footer>
			</div>
		</div>
	</div>
</div>
