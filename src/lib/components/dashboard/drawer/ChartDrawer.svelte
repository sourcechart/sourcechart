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
		if (open === false) {
			activeChart.set(!$activeChart);
		} else if (open === true) {
			activeChart.set(!$activeChart);
		}
	});

	function clearUpdatedChartObject() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 100);
	}

	function cInside() {
		open = false;
	}

	function cOutside() {
		open = true;
	}

</script>

<div
	use:clickInside
	on:click_inside={cInside}
	use:clickOutside
	on:click_outside={cOutside}
	class="flex absolute container justify-center"
>
	<CustomSideBar bind:open={$activeChart} />
</div>


<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
	}

	.open {
		left: 0;
	}
</style>
