<script>
	import Arrow from '$lib/components/landing/homepage/icons/Arrow.svelte';
	import Hand from '$lib/components/landing/homepage/icons/Hand.svelte';
	import InfinityIcon from '$lib/components/landing/homepage/icons/InfinityIcon.svelte';

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
			component: InfinityIcon,
			header: 'Your data is yours',
			body: 'Data never leaves your computer. This ensures  that  your data stays private'
		}
	];
</script>

<div
	class="w-full h-full font-maven bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#3e3e3e]"
>
	<section id="navbar" class="py-2 h-22 px-2 sm:px-4 md:px-8 lg:px-10">
		<div class="navbar w-full flex justify-between items-center">
			<div
				class="ml-2 sm:ml-3 md:ml-4 lg:ml-8 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-60 max-w-200 relative"
			>
				<img class="w-34 h-10 absolute -mt-4 top-0 left-0" src="logo1.png" alt="Logo" />
				<!-- Aspect ratio box: 1:1 -->
			</div>
			<div class="mr-2 sm:mr-3 md:mr-4 lg:mr-4">
				<button
					class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl h-10 sm:h-14 md:h-16 lg:h-20 xl:h-24 text-neutral-300 hover:text-neutral-50 border border-neutral-300 hover:border-neutral-50 hover:bg-neutral-800 font-maven leading-normal tracking-tight xl:h-18 flex items-center shadow-lg px-2 sm:px-4 md:px-6 lg:px-8"
				>
					Login
				</button>
			</div>
		</div>
	</section>
	<div
		class="w-full h-full font-maven bg-gradient-to-br from-neutral-900 via-neutral-800 to-[#3e3e3e]"
		style="background-image: url('backlighting.png');"
	>
		<section id="space" class="w-full h-20" />

		<section class="sm:mt-32 h-4/5 py-4 px-2 sm:px-4 md:px-8 lg:px-10 mt-24 bg-center bg-cover">
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
								SourceChart processes gigabytes of data locally that moves as fast as you think.
							</span>
						</div>
						<div class="flex flex-wrap items-center mt-4 space-x-4">
							<button
								class="bg-blue-700 border border-white px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg shadow-lg leading-normal tracking-tight hover:bg-blue-800"
							>
								<span> Sign Up </span>
							</button>
							<button
								class="text-neutral-300 border border-white px-4 py-2 text-xs sm:text-sm md:text-base lg:text-lg shadow-lg leading-normal tracking-tight hover:bg-gray-700"
							>
								<span>Learn More</span>
							</button>
						</div>
					</div>
				</div>
				<div
					class="mt-4 md:mt-0 flex-grow md:w-1/2 lg:w-2/5 xl:w-1/2 2xl:w-3/5 relative md:h-60 lg:h-1/3 xl:h-1/2 2xl:h-2/3"
				>
					<div class="w-full h-full">
						<img class="w-full h-full object-cover object-center" src="hero2.png" alt="Logo" />
					</div>
				</div>
			</div>
		</section>

		<section class="sm:mt-32 h-4/5 py-4 px-2 sm:px-4 md:px-8 lg:px-10 mt-24">
			<div
				class="text-neutral-300 flex flex-col items-center justify-center space-y-4 md:space-y-8 lg:space-y-10 px-2 sm:px-4 md:px-8 lg:px-10"
			>
				<!-- Features Text and Subtext -->
				<div class="flex flex-col items-center text-center space-y-2 w-full">
					<span class="text-5xl">Features</span>
					<span class="font-thin text-base sm:text-lg w-2/3">
						Most dashboards are designed for data visualization and monitoring purposes. SourceChart
						is designed to find insights.
					</span>
				</div>

				<div
					class="flex flex-col space-y-4 md:space-y-0 md:space-x-6 lg:space-x-8 w-full justify-evenly"
				>
					<!-- Video Container -->
					<div
						class="flex flex-shrink-0 video-container overflow-hidden max-w-full md:max-w-none mb-4 md:mb-0 justify-center items-center"
					>
						<video autoplay loop muted class="video-style w-full">
							<source src="demoMP4.mp4" type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</div>

					<!-- Features Container -->
					<div class="justify-center flex">
						<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full mt-10">
							{#each features as feature}
								<div
									class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-96 p-4 h-full md:h-96 bg-neutral-800 text-neutral-300 rounded-md"
								>
									<div class="flex items-center space-x-2">
										<svelte:component this={feature.component} />
										<span class="text-xl font-semibold">{feature.header}</span>
									</div>
									<div class="mt-2">
										<span class="text-base">{feature.body}</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="py-4 px-2 sm:px-4 md:px-8 lg:px-10" />
		<footer class="justify-center flex bg-neutral-800">
			<div class="legal-section">
				<a href="/privacy-policy">Privacy Policy</a>
				<a href="/terms-and-conditions">Terms and Conditions</a>
				<a href="/disclaimer"> Disclaimer</a>
			</div>
		</footer>
	</div>
</div>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&display=swap"
/>
