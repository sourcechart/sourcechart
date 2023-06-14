<script lang="ts">
	import { clearChartOptions } from '$lib/io/stores';
	import { Button } from 'flowbite-svelte';

	function clearUpdatedChartObject() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 100);
	}
</script>

<Button
	on:click={clearUpdatedChartObject}
	type="button"
	color="alternative"
	pill={false}
	outline={false}
>
	Clear Choices
</Button>
