<script lang="ts">
	import DatasetDropDown from './dropdown/DatasetDropDown.svelte';
	import AxisDropDrown from './dropdown/ColumnDropDrown.svelte';
	import Groupby from './dropdown/Groupby.svelte';
	import Aggregator from './dropdown/Aggregator.svelte';
	import SideBar from './components/SideBar.svelte';
	import { activeChart, clearChartOptions } from '$lib/io/stores';
	import { clickOutside, clickInside } from '$lib/actions/clickUtils';
	import { Drawer, Sidebar, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { onMount } from 'svelte';

	let drawerToggle: boolean; // = true

	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	const promiseWithDelay = function () {
		return new Promise(function (resolve) {
			setTimeout(resolve, 1000);
		});
	};

	onMount(async () => {
		await promiseWithDelay();
		if (drawerToggle === false) {
			activeChart.set(!$activeChart);
		} else if (drawerToggle === true) {
			activeChart.set(!$activeChart);
		}
	});

	function clearUpdatedChartObject() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 100);
	}

	function cInside(event: Event) {
		drawerToggle = false;
	}

	function cOutside(event: Event) {
		drawerToggle = true;
	}
</script>
{#if drawerToggle}
<Sidebar />
{/if}