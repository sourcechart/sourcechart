<div class="backgroundColor w-full h-full generalPadding">
	<div class="navbar w-full flex justify-between items-center pb-4">
		<!-- Logo -->
		<div class="mr-4">
			<img class="logo-size object-contain" src="logo1.png" alt="Logo" />
		</div>

		<!-- Login Button -->
		<div class="button-height shadow border border-white justify-end items-center inline-flex ml-4">
			<div class="p-2.5 justify-start items-center gap-2.5 flex">
				<button
					class="text-white lg:text-base md:text-sm sm:text-xs shadow-lg font-normal font-['?????'] leading-normal tracking-tight"
				>
					Login
				</button>
			</div>
		</div>
	</div>
	<div class="bg-gray-50 h-full">Hello world</div>
</div>

<style>
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
</style>
