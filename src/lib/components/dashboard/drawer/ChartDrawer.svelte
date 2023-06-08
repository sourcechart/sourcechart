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
	import CustomSidebar from './components/CustomSidebar.svelte'; // ensure the path is correct


	let open: boolean; // = true

	$: console.log($activeChart, open)

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

	function cInside(event: Event) {
		open = false;
	}

	function cOutside(event: Event) {
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
	<CustomSidebar bind:open={$activeChart} id="sidebar2">
	<div class="overflow-y-auto py-4 px-3 rounded dark:bg-gray-800">
		<DatasetDropDown />
		<AxisDropDrown axis={'X'} />
		<AxisDropDrown axis={'Y'} />

		<div
			class="text-center font-medium focus:ring-4 focus:outline-none inline-flex items-center justify-center px-5 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 dark:border-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 hover:text-blue-700 focus:text-blue-700 dark:focus:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:bg-transparent dark:border-gray-800 dark:hover:border-gray-700 rounded-lg"
		>
			Choose Y Axis Aggregator
		</div>

		<Aggregator />
		<Groupby />

		<button
			on:click={clearUpdatedChartObject}
			type="button"
			class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
		>
			Clear Choices
		</button>
	</div>
</CustomSidebar>
</div>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out
	}
	
	.open {
		left: 0
	}
</style>