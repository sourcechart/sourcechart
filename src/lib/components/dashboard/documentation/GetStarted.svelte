<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import { Carousel } from 'flowbite-svelte';
	import { timesVisitedDashboard } from '$lib/io/stores';

	var visits = $timesVisitedDashboard;
	var newVisit = Number(visits) + 1;
	$timesVisitedDashboard = newVisit;

	const images = [
		{
			id: 0,
			name: 'Navigation Bar for Uploading Files and Creating Plots',
			imgurl: '/NavBar.png'
		},
		{
			id: 1,
			name: 'Choose Dataset and Axis',
			imgurl: '/SideDrawer.png'
		},
		{
			id: 2,
			name: 'Created Bar Plot',
			imgurl: '/BarChart.png'
		}
	];
	let defaultModal = true;
	let showThumbs = false;
	let showCaptions = true;
	let slideControls = true;
</script>

{#if $timesVisitedDashboard === 1}
	<Modal title="Getting Started" bind:open={defaultModal} autoclose>
		<Carousel {images} {showThumbs} {showCaptions} {slideControls} />
	</Modal>
{/if}
