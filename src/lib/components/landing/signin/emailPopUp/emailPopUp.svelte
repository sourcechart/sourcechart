<script lang="ts">
	import va from '@vercel/analytics';
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	let email: string = '';
	let showPopup: boolean = true;

	$: emailClass = emailValid ? 'border-gray-300 rounded-md' : 'border-red-500 rounded-md';

	const dispatch = createEventDispatcher();

	function handleSubmit() {
		// Validate the email address before allowing the user to continue
		if (validateEmail(email)) {
			va.track('signInEmail', { email: email });
			showPopup = false;
			dispatch('emailEntered', { email });
			goto('/dashboard/dashboard'); // Redirect to the /dashboard endpoint
		} else {
			alert('Please enter a valid email address.');
		}
	}
	function validateEmail(email: string) {
		// Simple email validation regex
		const emailRegex = /^\w+([.-]`?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		return emailRegex.test(email);
	}

	$: emailValid = email ? validateEmail(email) : true;
</script>

<div class="relative flex h-full flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
	<div
		class="absolute inset-0 bg-[url(/img/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
	/>
	<div
		class="relative bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
	>
		<div class="mx-auto max-w-md justify-center items-center">
			<a href="/" class="h-8 w-auto mx-auto">
				<img src="/logo.png" class="h-8 w-auto mx-auto" alt="Source Chart Logo" />
			</a>
			<h2 class="text-3xl text-center mb-6 mt-6">Enter Email to Continue</h2>

			<form action="?/login" method="POST" class="auth-form">
				<input
					id="email"
					type="text"
					name="email"
					placeholder="Email Address"
					class="w-full p-2 mb-4 border {emailClass}"
					bind:value={email}
				/>
			</form>
			<button
				type="submit"
				class="mt-4 w-full py-2 px-4 text-black rounded-md login-with-button"
				disabled={!emailValid}
				on:click={handleSubmit}>Continue</button
			>
		</div>
	</div>
</div>

<style>
	.popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 9999;
	}

	.content {
		background-color: #fff;
		padding: 20px;
		text-align: center;
	}

	.login-with-button {
		transition: background-color 0.3s, box-shadow 0.3s;

		border: none;
		border-radius: 3px;
		box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);

		color: #757575;
		font-size: 14px;
		font-weight: 500;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

		background-color: white;
		background-repeat: no-repeat;
		background-position: 12px 11px;

		&:hover {
			box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
		}

		&:active {
			background-color: #eeeeee;
		}

		&:focus {
			outline: none;
			box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25), 0 0 0 3px #c8dafc;
		}

		&:disabled {
			filter: grayscale(100%);
			background-color: #ebebeb;
			box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
			cursor: not-allowed;
		}
	}
</style>
