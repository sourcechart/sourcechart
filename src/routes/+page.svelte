<script>
	import Hero from '$lib/components/landing/homepage/Hero.svelte';
</script>

<div class="w-full h-full">
	<section id="navbar" class="py-2 h-22 bg-[#121212] px-2 sm:px-4 md:px-8 lg:px-10">
		<div class="navbar w-full flex justify-between items-center">
			<div
				class="ml-2 sm:ml-3 md:ml-4 lg:ml-4 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-60 max-w-200"
			>
				<img
					class="w-full h-16 sm:h-14 md:h-16 lg:h-20 xl:h-24 object-contain"
					src="logo1.png"
					alt="Logo"
				/>
			</div>
			<div
				class="mr-2 sm:mr-3 md:mr-4 lg:mr-4 h-10 sm:h-12 md:h-14 lg:h-16 xl:h-18 flex items-center shadow border border-white px-2 sm:px-3 md:px-4 lg:px-4"
			>
				<button
					class="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl h-16 sm:h-14 md:h-16 lg:h-20 xl:h-24 text-white shadow-lg font-maven leading-normal tracking-tight px-2 sm:px-4 md:px-6 lg:px-8"
				>
					Login
				</button>
			</div>
		</div>
	</section>

	<section class="px-2 sm:px-4 md:px-8 lg:px-10">
		<div class="text-black">Hello World</div>
	</section>
</div>

<!--
	<section id="Hero" class="mt-8">
		<div class="h-24 text-white font-maven flex mt-10">
			<div class="">
				<span class="shadow-lg font-medium xl:text-6xl lg:text-6xl md:text-5xl">
					Sharpen Your Insight.
				</span>
				<div class="mt-6">
					<span class="shadow-md font-thin lg:text-2xl">
						SourceChart processes gigabytes of data locally that moves as fast as you think.
					</span>
				</div>
				<div class="flex items-center mt-4 space-x-4">
					<button
						class="bg-blue-700 border border-white px-4 py-2 text-white lg:text-base md:text-sm sm:text-xs shadow-lg leading-normal tracking-tight hover:bg-blue-800"
					>
						<span class="text-lg"> Sign Up </span>
					</button>
					<button
						class="text-white border border-white px-4 py-2 lg:text-base md:text-sm sm:text-xs shadow-lg leading-normal tracking-tight hover:bg-gray-700"
					>
						<span class="text-lg">Learn More</span>
					</button>
				</div>
			</div>
			<div class="px-8 mt-10">
				<Hero />
			</div>
		</div>
	</section>
	<section id="features" class="mt-8">
		<div class="bg-gray-50">Hello world</div>
	</section>
	</div>

	-->

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&display=swap"
/>

<style>
	.font-maven {
		font-family: 'Maven Pro', sans-serif;
	}
</style>
