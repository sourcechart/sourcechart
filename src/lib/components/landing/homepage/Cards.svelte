<script>
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
				'SourceChart.io prioritizes data security. Your data never hits our serves to ensure your data remains secure and confidential.'
		}
	];
</script>

<section class="relative">
	<div class="flex flex-wrap justify-center max-h-36">
		{#each features as feature}
			<div class="flex flex-col p-4 max-w-md sm:w-1/2 lg:w-1/4">
				<div class="flex-grow rounded-lg bg-white p-6 shadow-lg flex flex-col">
					<h2 class="mb-2 max-w-xl text-center text-2xl font-bold text-gray-900">
						{feature.title}
					</h2>
					<p class="flex-grow text-gray-700">
						{feature.description}
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>
