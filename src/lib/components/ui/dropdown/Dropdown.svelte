<script lang="ts">
	//import { dropdownStore } from '$lib/io/stores';
	export let id: string;
</script>

<div {id}>
	<div class="dropdown-menu">
		<slot />
	</div>
</div>
