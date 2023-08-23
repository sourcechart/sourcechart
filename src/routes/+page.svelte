<script lang="ts">
	import { goto } from '$app/navigation';

	const enterFree = () => {
		goto('/login');
	};

	let features = [
		{
			title: 'Advanced Data Visualizations',
			description: 'Interactive visualizations for faster and more effective decision-making.'
		},
		{
			title: 'Robust Analytics',
			description: 'Deep insights into your business trends and patterns.'
		},
		{
			title: 'Security and Compliance',
			description: 'Top-tier data security, keeping your information confidential.'
		}
	];
</script>

<title>SourceChart</title>
<nav class="navbar">
	<div class="logo">
		<a href="/" class="logo-link">
			<img src="logo1.png" alt="Logo" class="logo-img" />
		</a>
	</div>
	<div class="navbar-links">
		<button on:click={enterFree} class="try-now-button"> Try Now </button>
	</div>
</nav>

<section class="hero-section">
	<div class="hero-content">
		<h1 class="hero-title text-black">Large Data Visualizations without the Cloud</h1>
		<p class="hero-description text-black">
			Revolutionize your data interactions with SourceChart.io.
		</p>
		<button on:click={enterFree} class="hero-button">Try Now</button>
	</div>
</section>

<section class="features-section">
	{#each features as feature}
		<div class="feature-card">
			<h2 class="feature-title">{feature.title}</h2>
			<p class="feature-description">{feature.description}</p>
		</div>
	{/each}
</section>

<footer class="footer">
	<div class="legal-section">
		<a href="/privacy-policy">Privacy Policy</a>
		<a href="/terms-and-conditions">Terms and Conditions</a>
		<a href="/disclaimer"> Disclaimer</a>
	</div>
</footer>

<style>
	/* NAVBAR */
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 3rem;
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
	}
	.logo-link {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: black;
	}
	.logo-img {
		height: 40px;
		margin-right: 1rem;
	}

	.try-now-button {
		padding: 0.5rem 2rem;
		background-color: #f15b5d;
		color: white;
		border: none;
		border-radius: 0.25rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.try-now-button:hover {
		background-color: #d94b4c;
	}

	/* HERO SECTION */
	.hero-section {
		background: url('path/to/your/background-image.jpg') center/cover no-repeat;
		padding: 6rem 3rem;
		color: white;
	}
	.hero-content {
		max-width: 800px;
	}
	.hero-title {
		color: black;
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}
	.hero-description {
		color: rgb(179, 179, 179);
		font-size: 1.25rem;
		margin-bottom: 2rem;
	}
	.hero-button {
		padding: 0.75rem 2rem;
		background-color: #f15b5d;
		color: white;
		border: none;
		border-radius: 0.25rem;
		font-weight: bold;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	.hero-button:hover {
		background-color: #d94b4c;
	}

	/* FEATURES SECTION */
	.features-section {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 3rem 0;
	}
	.feature-card {
		flex: 1 1 250px;
		background-color: white;
		border-radius: 0.25rem;
		padding: 2rem;
		margin: 1rem;
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s;
	}
	.feature-card:hover {
		transform: translateY(-10px);
	}
	.feature-title {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}
	.feature-description {
		color: #555;
	}

	/* FOOTER */
	.footer {
		padding: 2rem 0;
		background-color: #f3f4f6;
	}
	.legal-section {
		display: flex;
		justify-content: center;
		gap: 20px;
	}
	.legal-section a {
		text-decoration: none;
		color: #555;
		transition: color 0.3s;
	}
	.legal-section a:hover {
		color: #f15b5d;
	}
</style>
