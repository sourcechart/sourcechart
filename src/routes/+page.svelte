<script lang="ts">
	import Cards from '$lib/components/landing/homepage/Cards.svelte';
	import NavBar from '$lib/components/landing/homepage/NavBar.svelte';
	import Video from '$lib/components/landing/homepage/CallToAction.svelte';
	import Footer from '$lib/components/landing/homepage/Footer.svelte';

	let showDropdown = false; // State variable for dropdown menu visibility

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

<title>SourceChart</title>

<div>
	<NavBar />
	<Video videoWebm="sourcechartnetwork.webm" videoMp4="sourcechartnetwork.mp4" />
	<Cards />
	<Footer />
</div>
