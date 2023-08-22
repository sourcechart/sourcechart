<script lang="ts">
	export let open: boolean;
	export let id: string = '';
</script>

<div
	class={open
		? 'bg-gray-800 text-white w-64 overflow-auto transition-transform duration-200 ease-in-out rounded-md border-red-50'
		: '-translate-x-full invisible'}
	{id}
>
	<div class="p-6">
		<slot />
	</div>
</div>
