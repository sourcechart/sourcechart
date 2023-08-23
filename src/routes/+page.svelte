<script lang="ts">
	import { goto } from '$app/navigation';

	const enterFree = () => {
		goto('/login');
	};

	let features = [
		{
			title: 'Advanced Data Visualizations',
			description:
				'Our platform provides an interactive, visualizations of your complex data, leading to faster and more effective decision-making.'
		},
		{
			title: 'Robust Analytics',
			description:
				'We utilize advanced data analytics techniques to give you a deeper understanding of your business trends and patterns.'
		},
		{
			title: 'Security and Compliance',
			description:
				'SourceChart.io prioritizes data security. Your data never hits our servers to ensure your data remains secure and confidential.'
		}
	];
</script>

<title>SourceChart</title>
<nav class="navbar bg-gray-900">
	<div class="logo">
		<a href="/" class="logo-link">
			<img src="logo1.png" alt="Logo" class="logo-img" />
		</a>
	</div>
	<div class="navbar-links">
		<button on:click={enterFree} class="try-now-button">Try Now</button>
	</div>
</nav>

<section class="hero-section">
	<video autoplay muted loop class="hero-video">
		<source src="/demoMP4.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>
	<div class="hero-content">
		<h1 class="hero-title">Large Data Visualizations without the Cloud</h1>
		<p class="hero-description">Revolutionize your data interactions with SourceChart.io.</p>
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

<footer class="footer bg-gray-900">
	<div class="legal-section">
		<a href="/privacy-policy">Privacy Policy</a>
		<a href="/terms-and-conditions">Terms and Conditions</a>
		<a href="/disclaimer"> Disclaimer</a>
	</div>
</footer>

<style>
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 3rem;
		color: white;
	}

	.logo,
	.navbar-links {
		display: flex;
		align-items: center; /* Align items vertically in the center */
	}

	.logo-link {
		display: flex;
		align-items: center;
		text-decoration: none;
		color: white;
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

	.try-now-button:hover {
		background-color: #d94b4c;
	}

	/* HERO SECTION */
	.hero-section {
		position: relative;
		padding: 6rem 3rem;
		color: white;
	}
	.hero-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 80%;
		object-fit: cover;
		z-index: -1;
		opacity: 0.9; /* Added transparency */
	}

	.hero-content {
		position: relative;
		z-index: 10;
		max-width: 800px;
	}
	.hero-title {
		color: white;
		font-size: 2.5rem;
		margin-bottom: 1rem;
		font-weight: bold;
	}
	.hero-description {
		color: white;
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
		color: white;
	}
	.legal-section {
		display: flex;
		justify-content: center;
		gap: 20px;
	}
	.legal-section a {
		text-decoration: none;
		color: white;
		transition: color 0.3s;
	}
	.legal-section a:hover {
		color: #f15b5d;
	}
</style>
