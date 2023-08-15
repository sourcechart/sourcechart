<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import FileDrop from './components/FileDrop.svelte';
</script>

<div
	class="relative bg-white dark:bg-slate-700 px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"
>
	<div class="mx-auto max-w-md">
		<h1>Add Data to Plot</h1>
		<Tabs>
			<TabItem title="Load Files" open>
				<div class="pt-8 text-base font-semibold leading-7">
					<FileDrop />
					<p class="text-gray-900">Want to dig deeper into Tailwind? Hello Hellow Hellow Hellow</p>
				</div>
			</TabItem>
			<TabItem title="External Datasets">
				<p>Tab 2 content</p>
			</TabItem>
		</Tabs>
	</div>
</div>
