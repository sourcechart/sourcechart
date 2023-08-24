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
	<button
		on:click={enterFree}
		class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 font-bold"
	>
		Try Now
	</button>
</nav>

<section class="py-16 text-black px-4 mt-20 mb-20">
	<h1 class="text-3xl mb-4 mt-8 font-bold py-10">Large Data Visualizations without the Cloud</h1>
	<p class="text-xl mb-8 max-w-xl mx-auto">
		Revolutionize your data interactions with SourceChart.io.
	</p>
	<button
		on:click={enterFree}
		class="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-500 font-bold"
	>
		Try Now
	</button>
</section>
<section class="px-4 mt-20">
	<h2 class="text-xl mb-4 font-bold">Use SourceChart directly inside your browser</h2>
	<DeviceMockup device="laptop">
		<video autoplay muted loop class="dark:hidden h-[156px] md:h-[278px] w-full rounded-xl">
			<source src="/demoMP4.mp4" type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	</DeviceMockup>
</section>

<section class="py-12 space-y-8">
	{#each features as feature}
		<div class="p-8 bg-white shadow-md rounded transform hover:scale-105 transition-transform mx-4">
			<h2 class="text-xl mb-4 font-bold">{feature.title}</h2>
			<p class="text-gray-600">{feature.description}</p>
		</div>
	{/each}
</section>

<footer class="bg-gray-900 py-8 text-white">
	<div class="flex justify-center space-x-8">
		<a href="/privacy-policy" class="hover:text-red-600 transition-colors">Privacy Policy</a>
		<a href="/terms-and-conditions" class="hover:text-red-600 transition-colors"
			>Terms and Conditions</a
		>
		<a href="/disclaimer" class="hover:text-red-600 transition-colors">Disclaimer</a>
	</div>
</footer>
