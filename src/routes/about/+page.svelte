<script>
	import { goto } from '$app/navigation';
</script>

<div
	class="w-full h-full font-maven bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"
>
	<!-- Navbar Section -->
	<section id="navbar" class="py-2 h-22 px-2 sm:px-4 md:px-8 lg:px-10">
		<div class="navbar w-full flex justify-between items-center">
			<div
				class="ml-2 sm:ml-3 md:ml-4 lg:ml-8 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 min-w-60 max-w-200 relative"
			>
				<a href="/">
					<img class="w-34 h-10 absolute -mt-4 top-0 left-0" src="logo1.png" alt="Logo" />
					<!-- Aspect ratio box: 1:1 -->
				</a>
			</div>
			<div class="mr-2 sm:mr-3 md:mr-4 lg:mr-4 flex items-center flex-wrap h-10">
				<button
					class="text-xs flex justify-center h-8 items-center sm:text-sm md:text-base lg:text-lg xl:text-xl w-20 sm:h-14 md:h-16 lg:h-20 xl:h-24 text-neutral-300 hover:text-neutral-50 hover:border-neutral-50 border hover:bg-neutral-800 border-neutral-300 font-maven leading-normal tracking-tight xl:h-18 shadow-lg px-2 sm:px-4 md:px-6 lg:px-8"
					on:click={() => {
						goto('/dashboard');
					}}
				>
					Login
				</button>
			</div>
		</div>
	</section>

	<!-- Background Image Section -->
	<div
		class="w-full h-full font-maven bg-cover bg-center"
		style="background-image: url('backlighting.png');"
	>
		<section class="py-8 px-4 mt-12 text-center">
			<h1 class="text-5xl font-bold text-white mb-6">About us</h1>
		</section>
		<section id="space" class="w-full" />

		<!-- Mission Section -->
		<section id="Mission" class="h-4/5 py-4 px-4">
			<div
				class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-96 p-4 h-full md:h-96 bg-neutral-800 text-neutral-300 rounded-md"
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
		</section>
		<div class="h-24 w-full" />

		<!-- How it Works Section -->
		<section id="Stack" class="h-4/5 py-4 px-4">
			<div
				class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-96 p-4 h-full md:h-96 bg-neutral-800 text-neutral-300 rounded-md"
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

		<!-- Testimonials Section -->
		<!--
		<section id="Testimonials" class="h-4/5 py-4 px-4 mt-24">
			<div
				class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-96 p-4 h-full md:h-96 bg-neutral-800 text-neutral-300 rounded-md"
			>
				<h1 class="text-3xl font-bold text-white mb-6">What Our Users Say</h1>
				<div class="text-white ml-4 mr-4 leading-relaxed">
					<blockquote class="mb-6">
						"Using [Company Name]'s platform has transformed our business. The insights we gain are
						invaluable." - [Name, Company]
					</blockquote>
					<blockquote>
						"The commitment to security and ease of use is unparalleled. Truly a game-changer in the
						world of data visualization!" - [Name, Company]
					</blockquote>
				</div>
			</div>
		</section>
		<div class="h-24 w-full" />
        -->

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

		<!-- Spacer -->

		<!-- Footer Section -->
		<footer class="flex justify-center items-center bg-neutral-900 h-16">
			<div class="legal-section text-sm space-x-3 text-neutral-300 hover:text-neutral-50">
				<a href="/privacy-policy">Privacy Policy</a>
				<a href="/terms-and-conditions">Terms and Conditions</a>
				<a href="/disclaimer">Disclaimer</a>
			</div>
		</footer>
	</div>
</div>
