<script>
	import Hero from '$lib/components/landing/homepage/Hero.svelte';
</script>

<div class="backgroundColor w-full h-full generalPadding">
	<section id="navbar">
		<div class="navbar w-full flex justify-between items-center pb-4">
			<div class="mr-4">
				<img class="logo-size object-contain" src="logo1.png" alt="Logo" />
			</div>
			<div
				class="button-height shadow border border-white justify-end items-center inline-flex ml-4 px-4"
			>
				<div class="px-8 justify-start items-center flex">
					<button
						class="text-white lg:text-base md:text-sm sm:text-xs shadow-lg font-normal mavenFont leading-normal tracking-tight"
					>
						Login
					</button>
				</div>
			</div>
		</div>
	</section>
	<section id="Hero">
		<div class="h-24 callToAction text-white sm:text-4xl mavenFont flex">
			<div class="">
				<span class="text-6xl shadow-lg font-medium"> Sharpen Your Insight. </span>
				<div class="mt-6">
					<span class="text-xl shadow-md font-thin">
						SourceChart processes gigabytes of data locally that moves as <br /> fast as you think.
					</span>
				</div>
				<div class="flex items-center">
					<button
						class="mt-4 bg-blue-700 border border-1 border-white p-4 text-white lg:text-base md:text-sm sm:text-xs shadow-lg font-normal mavenFont leading-normal tracking-tight"
					>
						<span class="text-lg"> Sign Up </span>
					</button>
					<button
						class="mt-4 text-white border border-1 border-white p-4 lg:text-base md:text-sm sm:text-xs shadow-lg font-normal mavenFont leading-normal tracking-tight"
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
</div>

<link
	rel="stylesheet"
	href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&display=swap"
/>

<style>
	.callToAction {
		align-items: center;
		justify-content: center;
		margin-top: 30%;
		background-color: #181818;
		display: flex;
	}
	.mavenFont {
		font-family: 'Maven Pro', sans-serif;
	}
	.backgroundColor {
		background-color: #181818;
	}
	.generalPadding {
		padding-top: 2%;
		padding-left: 10%;
		padding-right: 10%;
	}
	.navbar {
		height: 80px; /* Default to large size */
	}
	.logo-size {
		height: 56px; /* Default to large size */
		width: auto; /* Maintain aspect ratio */
	}
	.button-height {
		height: 56px; /* Default to large size */
		padding: 0 1rem; /* Adjust padding to match height */
	}
	@media (max-width: 1024px) {
		/* This corresponds to the default lg breakpoint in Tailwind */
		.navbar {
			height: 52px; /* Medium size */
		}
		.logo-size {
			height: 44px; /* Medium size */
		}
		.button-height {
			height: 44px; /* Medium size */
			padding: 0 0.8rem; /* Adjust padding to match height */
		}
		.generalPadding {
			padding-left: 8%;
			padding-right: 8%;
		}
	}
	@media (max-width: 640px) {
		/* This corresponds to the default sm breakpoint in Tailwind */
		.navbar {
			height: 40px; /* Small size */
		}
		.logo-size {
			height: 32px; /* Small size */
		}
		.button-height {
			height: 32px; /* Small size */
			padding: 0 0.6rem; /* Adjust padding to match height */
		}
		.generalPadding {
			padding-left: 5%;
			padding-right: 5%;
		}
	}
	#Hero {
		margin-top: 5%; /* Adjust this value to control the top spacing */
	}
</style>
