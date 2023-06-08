<script lang="ts">
	import type { SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase'; //@ts-ignore
	import Cards from '$lib/components/landing/homepage/Cards.svelte';
	import NavBar from '$lib/components/landing/homepage/NavBar.svelte';
	import Video from '$lib/components/landing/homepage/CallToAction.svelte';
	import Footer from '$lib/components/landing/homepage/Footer.svelte'

	let showDropdown = false; // State variable for dropdown menu visibility

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	let email = 'contact@sourcechart.io';
	let phoneNumber = 'Your phone number here';
	let address = 'Your address here';

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();
		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>
<title>SourceChart</title>

<div>
	<NavBar />
	<Video videoWebm="sourcechartnetwork.webm" videoMp4="sourcechartnetwork.mp4" />
	<Cards />
	<Footer />
</div>
