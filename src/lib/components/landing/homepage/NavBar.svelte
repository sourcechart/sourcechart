<script lang="ts">
	import { goto } from '$app/navigation';
	const logo = '/logo.png';

	const enterFree = () => {
		goto('/dashboard/emailSignIn');
	};

	const signIn = () => {
		goto('/dashboard/login');
	};

	const signUp = () => {
		goto('/dashboard/signup');
	};
</script>

<nav class="navbar">
	<div class="logo">
		<a
			href="/"
			class="logo-link mr-4 flex items-center text-2xl font-bold text-gray-800 hover:text-gray-600"
		>
			<img src={logo} alt="Logo" class="w-auto h-10 mr-2" />
		</a>
	</div>
	<div class="navbar-links">
		<div class="text-sm">
			<!-- You can put additional links here -->
		</div>
		<button
			on:click={enterFree}
			class="try-now-button inline-block text-xl font-bold px-4 py-2 leading-none border rounded-md text-white bg-red-600 border-black hover:border-transparent hover:text-white hover:bg-black desktop"
		>
			Try Now
		</button>
		<button
			on:click={enterFree}
			class="try-now-button inline-block text-xl font-bold px-4 py-2 leading-none border rounded-md text-white bg-red-600 border-black hover:border-transparent hover:text-white hover:bg-black mobile"
		>
			Try Now
		</button>
	</div>
</nav>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 6px;
		background-color: white;
		box-shadow: none;
		border: none;
	}

	.logo {
		display: flex;
		align-items: center;
	}

	.logo-link {
		margin-right: 4px;
	}

	.navbar-links {
		display: flex;
		align-items: center;
	}

	.try-now-button {
		margin-top: 4px;
		margin-left: 10px;
	}

	.desktop {
		display: none;
	}

	@media screen and (min-width: 1000px) {
		.desktop {
			display: inline-block;
		}
		.mobile {
			display: none;
		}
	}
</style>
