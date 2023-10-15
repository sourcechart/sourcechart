<script lang="ts">
	import { zoom } from '$lib/io/Stores';
	import PlusSolid from '$lib/components/ui/icons/PlusSolid.svelte';
	import Minus from '$lib/components/ui/icons/Minus.svelte';
</script>

<div class="flex justify-center h-10 items-center rounded-md shadow-lg bg-neutral-800">
	<div class=" divide-neutral-700 flex items-center justify-items-center space-x-2">
		<button>
			<Minus />
		</button>

		<div>
			{$zoom * 100 + '%'}
		</div>
		<button>
			<PlusSolid />
		</button>
	</div>
</div>
