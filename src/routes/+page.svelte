<script lang="ts">
	import { goto } from '$app/navigation';
	import DeviceMockup from 'flowbite-svelte/DeviceMockup.svelte';

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
<nav class="bg-gray-900 p-4 flex justify-between items-center">
	<a href="/" class="flex items-center text-white space-x-2">
		<img src="logo1.png" alt="Logo" class="h-10" />
	</a>
	<button on:click={enterFree} class="hero-button"> Try Now </button>
</nav>

<section class="hero-section">
	<img
		src="3d-techno-purple-background-with-flowing-dots.png"
		alt="Techno Purple Background"
		class="hero-background"
	/>
	<div class="hero-content">
		<h1 class="hero-title text-6xl">Data Visualizations without the Cloud</h1>
		<p class="hero-description">Revolutionize your data interactions with SourceChart.io.</p>
		<button on:click={enterFree} class="hero-button">Try Now</button>
	</div>
</section>

<section class="features-section">
	<h1 class="bg-slate-900 text-4xl">About</h1>
	<div class="features-grid">
		<!-- This div will hold the cards -->
		<div class="feature-card">
			<p class="feature-description">
				Experience secure in-browser data visualization with our solution that ensures your data
				never ventures beyond your device. Visualize and process data directly within your browser,
				free from cloud-related concerns. Harnessing the power of OPFS API, WASM, and Sveltekit, our
				platform captures the finesse of excalichart. By integrating SQLiteWASM and DuckDBWASM, we
				ensure smooth data handling, beautifully brought to life via echarts in Sveltekit. And with
				the reliability of hosting on Vercel, you get all the convenience without any of the risks.
				Step into a safer, more efficient visualization journey with us.
			</p>
		</div>
	</div>
</section>

<section class="features-section">
	<h1 class="bg-slate-900 text-4xl">Feature Selection</h1>
	<div class="features-grid">
		<!-- This div will hold the cards -->
		{#each features as feature}
			<div class="feature-card">
				<h2 class="feature-title">{feature.title}</h2>
				<p class="feature-description">{feature.description}</p>
			</div>
		{/each}
	</div>
</section>

<section class="usage-section mb-4">
	<h1 class="text-4xl mb-4 usage-title">Usage</h1>
	<div class="usage-card">
		<DeviceMockup device="desktop">
			<video autoplay loop muted playsinline class="h-[156px] md:h-[278px] w-full rounded-xl">
				<source src="demoMP4.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</DeviceMockup>
	</div>
</section>

<footer class="footer bg-gray-900">
	<div class="legal-section">
		<a href="/privacy-policy">Privacy Policy</a>
		<a href="/terms-and-conditions">Terms and Conditions</a>
		<a href="/disclaimer"> Disclaimer</a>
	</div>
</footer>

<style>
	/* HERO SECTION */
	.hero-section {
		position: relative;
		display: flex;
		align-items: center;
		padding: 3rem 2rem; /* Added some horizontal padding */
		color: white;
		overflow: hidden;
	}

	.hero-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 80%;
		object-fit: cover;
		z-index: -1;
		opacity: 0.9; /* Adjust opacity as needed */
	}

	.hero-content {
		position: relative;
		z-index: 10;
		text-align: left; /* Center the content of hero-content */
		padding: 1rem; /* Additional padding to ensure content doesn't touch the edges */
		max-width: 90%; /* Makes sure the content doesn't span the full width of the hero section, adjust if necessary */
	}
	.hero-description {
		color: white;
		font-size: 1.5vw; /* Adjusts the font size based on the viewport width */
		margin-bottom: 2rem;
		max-font-size: 1.5rem; /* Set a maximum size if necessary */
	}
	.hero-description {
		color: white;
		font-size: 1.5rem;
		margin-bottom: 2rem;
	}
	.hero-button {
		padding: 0.75rem 2rem;
		background-color: #f25c5e;
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
		flex-direction: column; /* Stack children vertically */
		align-items: center; /* Center children horizontally */
		padding: 3rem 2rem; /* Added some horizontal padding */
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
		padding: 2rem 2rem; /* Added some horizontal padding */
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

	/* FEATURES SECTION */
	.features-section {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 2rem 0; /* adjusted top padding from 3rem to 2rem */
	}

	.features-grid {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		width: 100%;
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

	@media (max-width: 768px) {
		.hero-title {
			font-size: 4vw; /* Increase font size on smaller screens */
		}

		.hero-description {
			font-size: 2.5vw; /* Increase font size on smaller screens */
		}
	}

	.usage-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 3rem 2rem; /* Added some horizontal padding */
	}
	.usage-title {
		text-align: center; /* Center the title text */
		margin-bottom: 2rem; /* Space below the title */
	}
	.usage-card {
		width: 100%; /* Use full width */
		max-width: 1200px; /* Set a maximum width if desired */
	}
</style>
