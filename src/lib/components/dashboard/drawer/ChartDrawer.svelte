<script lang="ts">
	import DatasetDropDown from './dropdown/DatasetDropDown.svelte';
	import AxisDropDrown from './dropdown/ColumnDropDrown.svelte';
	import Groupby from './dropdown/Groupby.svelte';
	import Aggregator from './dropdown/Aggregator.svelte';
	import { activeChart, clearChartOptions } from '$lib/io/stores';
	import { clickOutside, clickInside } from '$lib/actions/clickUtils';
	import { Drawer, Sidebar, SidebarWrapper } from 'flowbite-svelte';
	import { sineIn } from 'svelte/easing';
	import { onMount } from 'svelte';
	import CustomSideBar from './components/CustomSideBar.svelte';
	let open: boolean; // = true

	let transitionParams = {
		easing: sineIn
	};

	const promiseWithDelay = function () {
		return new Promise(function (resolve) {
			setTimeout(resolve, 1000);
		});
	};

	function clearUpdatedChartObject() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 100);
	}

	function handleInside() {
		$activeChart = true;
	}

	function handleOutside(){
		$activeChart=false
	}


</script>

<div class="flex fixed top-0" use:clickInside on:click_inside={handleInside} use:clickOutside on:click_outside={handleOutside} >
		<CustomSideBar bind:open={$activeChart} />
</div>
