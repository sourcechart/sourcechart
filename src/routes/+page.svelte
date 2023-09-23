<script>
	import Arrow from '$lib/components/landing/homepage/icons/Arrow.svelte';
	import Hand from '$lib/components/landing/homepage/icons/Hand.svelte';
	import InfinityIcon from '$lib/components/landing/homepage/icons/InfinityIcon.svelte';
	import Security from '$lib/components/landing/homepage/icons/Security.svelte';
	import { goto } from '$app/navigation';

	let features = [
		{
			component: Arrow,
			header: 'A Single Source of Truth',
			body: 'Our platform provides an  interactive visualizations of your complex data. Leading to faster and more effective decision making.'
		},
		{
			component: Hand,
			header: `Robust Interface`,
			body: 'Everything is right where you would  expect it to be.'
		},
		{
			component: Security,
			header: 'Your data is yours',
			body: 'Data never leaves your computer. This ensures that your data stays private'
		},
		{
			component: InfinityIcon,
			header: 'Process gigabytes of data',
			body: 'Our platform is designed to handle large amounts of data. We are able to process gigabytes of data in seconds.'
		}
	];
</script>

<div
	class="w-full h-full font-maven bg-gradient-to-br bg-neutral-800 from-neutral-900 via-neutral-800 to-[#3e3e3e]"
>
	<!-- NavBar -->
	<section id="navbar" class="py-4 px-6 flex justify-between items-center">
		<a href="/" class="w-48">
			<img src="logo1.png" alt="Logo" class="w-full h-auto" />
		</a>
		<button
			class="text-neutral-300 bg-transparent border border-gray-400 hover:border-neutral-50 px-8 sm:px-10 md:px-12 py-2 sm:py-3 text-sm font-medium hover:bg-neutral-700"
			on:click={() => goto('/dashboard')}
		>
			Login
		</button>
	</section>

	<!-- Main Content -->
	<div
		class="relative w-full h-full py-16 px-6"
		style="background-image: url('backlighting.png'); background-size: cover; background-repeat: no-repeat;"
	>
		<div class="sm:mt-16" id="space" />

		<!-- Hero Section -->
		<section class=" h-4/5 py-4 px-2 sm:px-4 md:px-8 lg:px-10 bg-center bg-cover">
			<div
				class="text-white flex flex-col md:flex-row lg:flex-row space-y-4 md:space-y-0 lg:space-y-0 md:space-x-6 lg:space-x-6 ml-2 sm:ml-3 md:ml-4 lg:ml-8 mr-2 sm:mr-3 md:mr-4 lg:mr-4"
			>
				<div class="mb-4 md:mb-0 space-y-4">
					<div class="shadow-sm">
						<span
							class="font-medium block text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl"
						>
							Cut through the noise.
						</span>
						<div class="mt-2 md:mt-4">
							<span class="font-thin text-base sm:text-lg">
								SourceChart processes and visualizes gigabytes of data locally that moves as fast as
								you think.
							</span>
						</div>
						<div class="flex flex-wrap items-center mt-4 space-x-4">
							<button
								class="bg-purple-700 border border-white hover:border-neutral-50 hover:text-neutral-50 px-8 sm:px-10 md:px-12 py-2 sm:py-3 text-xs sm:text-sm md:text-base lg:text-lg shadow-lg leading-normal tracking-tight hover:bg-purple-600"
							>
								<span> Try Now </span>
							</button>

							<a href="#features-section">
								<button
									class="text-neutral-300 border border-white px-8 sm:px-10 md:px-12 py-2 sm:py-3 text-xs sm:text-sm md:text-base lg:text-lg shadow-lg leading-normal tracking-tight hover:bg-neutral-800 hover:text-neutral-50 hover:border-neutral-50"
								>
									<span>Learn More</span>
								</button>
							</a>
						</div>
					</div>
				</div>
				<div
					class="mt-4 md:mt-0 flex-grow md:w-1/2 lg:w-2/5 xl:w-1/2 2xl:w-3/5 relative md:h-60 lg:h-1/3 xl:h-1/2 2xl:h-2/3 z-10"
				>
					<div class="aspect-ratio-16-9">
						<img class="object-cover object-center z-10" src="hero2.png" alt="Logo" />
					</div>
				</div>
			</div>
		</section>
		<div class="h-32" id="space" />

		<!-- Features Section -->
		<section id="features-section">
			<h2 class="text-center text-4xl text-gray-300 mb-8">Features</h2>
			<p class="text-center text-gray-400 mb-16">
				Most dashboards are designed for data visualization and monitoring purposes. SourceChart is
				designed to find insights.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{#each features as feature}
					<div class="bg-neutral-800 p-6 rounded-lg space-y-4 text-white mb-4">
						<svelte:component this={feature.component} />
						<h3 class="text-2xl text-white">{feature.header}</h3>
						<p class="text-gray-400">{feature.body}</p>
					</div>
				{/each}
			</div>
		</section>
		<div class="h-24" id="space" />

		<!-- Video Section -->
		<section>
			<div class="flex justify-center items-center rounded-lg overflow-hidden">
				<video autoplay loop muted class="max-w-full h-auto">
					<source src="demoMP4.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			</div>
		</section>
		<div class="h-24" id="space" />

		<!-- ABOUT US -->
		<section id="about-us" class="flex flex-col items-center">
			<h2 class="text-center text-4xl text-gray-300 mb-8 w-full">About Us</h2>

			<div
				class="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 h-full md:h-80 sm:h-60 bg-neutral-800 text-neutral-300 rounded-md"
			>
				<h1 class="text-3xl font-bold text-white mb-6">Mission</h1>
				<div class="text-white ml-4 mr-4 leading-relaxed">
					Created in 2023, we set out with a clear mission - to revolutionize the data processing
					landscape. At SourceChart, we believe in security, speed, and clarity. Redefine your
					understanding of data with our swift, lightweight tool, designed to offer in-browser
					processing without compromise. As our commitment to you, we promise to move as fast as
					your thoughts, ensuring your data remains anchored and your insights razor-sharp.
				</div>
			</div>

			<div class="h-24 w-full" />
			<!-- Space between the sections -->

			<div
				class="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 h-full md:h-80 sm:h-60 bg-neutral-800 text-neutral-300 rounded-md"
			>
				<h1 class="text-3xl font-bold text-white mb-6">How it Works</h1>
				<div class="text-white ml-4 mr-4 leading-relaxed">
					Our platform invites you to a realm of secure, in-browser data visualization. We
					understand the essence of peace of mind - that's why your data never leaves your device.
					Witness the magic as we transform raw data into captivating visual stories, all the while
					ensuring seamless and secure handling. Supported by our robust hosting, we beckon you to
					embark on a safer, streamlined visualization odyssey with us.
				</div>
			</div>
		</section>

		<div class="h-24 w-full" />
		<!-- CTA Section -->
		<section id="JoinUs" class="h-4/5 py-4 px-4 mt-24 text-center">
			<h2 class="text-2xl font-bold text-white mb-6">Ready to Dive In?</h2>
			<p class="text-white mb-6">Discover the difference. Join our community today.</p>
			<button
				class="text-lg h-14 px-8 border-neutral-300 text-neutral-300 hover:text-neutral-50 hover:border-neutral-50 hover:bg-neutral-800 font-maven shadow-md"
				on:click={() => {
					goto('/dashboard');
				}}
			>
				Get Started
			</button>
		</section>
	</div>

	<!-- Footer -->
	<footer class="bg-neutral-900 py-4">
		<div class="text-center text-neutral-300 space-x-6">
			<a href="/privacy-policy" class="hover:underline">Privacy Policy</a>
			<a href="/terms-and-conditions" class="hover:underline">Terms and Conditions</a>
			<a href="/disclaimer" class="hover:underline">Disclaimer</a>
		</div>
	</footer>
</div>

<!-- Font Link -->
<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&display=swap"
/>

<style>
	.aspect-ratio-16-9 {
		padding-bottom: 66.66%;
		position: relative;
	}
	.aspect-ratio-16-9 img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
