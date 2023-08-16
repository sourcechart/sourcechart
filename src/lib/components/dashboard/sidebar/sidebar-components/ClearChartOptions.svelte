<script lang="ts">
	import { clearChartOptions } from '$lib/io/Stores';
	import { Button } from 'flowbite-svelte';

	function clearUpdatedChartObject() {
		$clearChartOptions = true;
		setTimeout(() => {
			$clearChartOptions = false;
		}, 100);
	}
</script>

<Button on:click={clearUpdatedChartObject} type="button" pill={false} outline={false}>
	Clear Choices
</Button>
