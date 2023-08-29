<script lang="ts">
	export let data;
	let username = '';
	let password = '';

	$: console.log(data);

	function handleSubmit(submitter) {
		// Perform authentication here
		console.log(`Username: ${username}, Password: ${password}`);
	}
</script>

<div class="flex justify-center items-center h-screen bg-gray-200">
	<div class="bg-white p-8 rounded-lg shadow-md w-96">
		<h1 class="text-2xl mb-4">Login</h1>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-600">Username</label>
				<input
					id="username"
					type="text"
					class="mt-1 p-2 w-full rounded-md border"
					bind:value={username}
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
