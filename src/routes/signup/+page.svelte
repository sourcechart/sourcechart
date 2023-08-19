<script lang="ts">
</script>

<div
	class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12"
>
	<div
		class="relative bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
	>
		<div class="mx-auto max-w-md">
			<img src="/img/logo.svg" class="h-6" alt="Tailwind Play" />
			<div class="w-full max-w-xs m-auto rounded p-5">
				<form>
					<div>
						<label class="block mb-2 outline-1" for="username">Email</label>
						<input
							class="w-full p-2 mb-6 border outline-gray-400 outline-1 rounded-md focus:bg-gray-300"
							type="text"
							name="username"
						/>
					</div>
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
						<label class="block mb-2" for="password">Confirm Password</label>
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
				<h1>GOOGLE SIGN IN BUTTON GOES HERE</h1>
				<footer>
					<a class=" hover:text-gray-400 text-sm float-left" href="#">Forgot Password?</a>
					<a class=" hover:text-gray-400 text-sm float-right" href="#">Create Account</a>
				</footer>
			</div>
		</div>
	</div>
</div>
