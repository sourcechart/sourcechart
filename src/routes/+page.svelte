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
		<div class="h-24 callToAction text-white mavenFont flex mt-10">
			<div class="-mt-7">
				<span class=" shadow-lg font-medium items-center xl:text-6xl lg:text-6xl md:text-5xl">
					Sharpen Your Insight.
				</span>
				<div class="mt-6">
					<span class=" shadow-md font-thin">
						SourceChart processes gigabytes of data locally that moves as fast as you think.
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
		height: 80px;
	}
	.logo-size {
		height: 56px;
		width: auto;
	}
	.button-height {
		height: 56px; /* Default to large size */
		padding: 0 1rem; /* Adjust padding to match height */
	}

	.callToAction {
		flex-direction: column; /* Default to column for mobile screens */
	}

	@media (min-width: 1025px) {
		.callToAction {
			flex-direction: row; /* Retain row display for larger screens */
			margin-top: 20%;
			align-items: center; /* Vertically center the items */
		}
		.callToAction > div.px-8.mt-0 {
			margin-top: 10%; /* Reset the margin for larger screens */
		}
	}

	/* For smaller screens */
	@media (max-width: 640px) {
		.callToAction > div {
			margin-top: 10%; /* Give some top margin between elements */
			text-align: center; /* Center the text */
			font-size: 2rem /* 60px */;
		}

		/* Adjust Hero positioning for smaller screens */
		.callToAction > div.px-8.mt-10 {
			order: 4; /* Make Hero component appear last */
		}

		/* Adjust title positioning for smaller screens */
		.callToAction > div > .text-6xl {
			order: 1; /* Make title appear first */
			text-align: center;
		}

		/* Adjust subtitle positioning for smaller screens */
		.callToAction > div > .mt-6 {
			order: 2; /* Make subtitle appear second */
			text-align: center;
		}

		/* Adjust buttons positioning for smaller screens */
		.callToAction > div > .flex.items-center {
			order: 3; /* Make buttons appear third */
			justify-content: center; /* Center the buttons */
		}
	}
</style>
