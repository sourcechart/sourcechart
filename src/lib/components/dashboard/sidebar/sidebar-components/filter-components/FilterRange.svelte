<script lang="ts">
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';
	export let column: string;
	export let min: number; // Min value of the slider
	export let max: number; // Max value of the slider

	let slider: HTMLElement;
	let dragging = false;
	let start: number = 0;
	let end: number = 1;

	export let prevData: any;
	export let lowHandle: string;
	export let highHandle: string;

	let handlesDragged = false;

	$: console.log(prevData);
	$: {
		if (!handlesDragged) {
			if (prevData) {
				lowHandle = String(prevData.min);
				highHandle = String(prevData.max);
			} else {
				lowHandle = '0';
				highHandle = '1';
			}
		}
	}

	$: i = clickedChartIndex();

	function updateFilter() {
		const existingFilter = $allCharts[$i].filterColumns.find((filter) => filter.column === column);

		if (existingFilter) {
			$allCharts[$i].filterColumns.find((filter) => filter.column === column).value = {
				min: lowHandle,
				max: highHandle
			};
		} else {
			$allCharts[$i].filterColumns = [
				...$allCharts[$i].filterColumns,
				{
					column: column,
					value: { min: lowHandle, max: highHandle }
				}
			];
		}
	}

	function draggable(node: HTMLElement) {
		let x: number;

		function handleMousedown(event: MouseEvent | TouchEvent) {
			console.log('handleMousedown called'); // <- Add this line

			dragging = true; // Set dragging to true here

			if (event.type === 'touchstart') {
				event = event as TouchEvent;
				x = event.touches[0].clientX;
			} else {
				event = event as MouseEvent;
				x = event.clientX;
			}

			node.dispatchEvent(
				new CustomEvent('dragstart', {
					detail: { x }
				})
			);

			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}

		function handleMousemove(event: MouseEvent | TouchEvent) {
			console.log('handleMousemove called'); // <- Add this line

			if (!dragging) return; // If not dragging, exit the function

			if (event.type === 'touchmove') {
				event = event as TouchEvent;
				x = event.changedTouches[0].clientX;
			} else {
				event = event as MouseEvent;
				x = event.clientX;
			}

			node.dispatchEvent(
				new CustomEvent('dragmove', {
					detail: { x }
				})
			);
			updateFilter();
		}

		function handleMouseup() {
			dragging = false; // Set dragging to false here
			updateFilter();
			node.dispatchEvent(
				new CustomEvent('dragend', {
					detail: { x }
				})
			);

			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}

		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown);

		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown);
			}
		};
	}

	function setHandlePosition(which: 'start' | 'end') {
		return function (evt: CustomEvent) {
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;

			var p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
			var actualValue = min + p * (max - min);
			p = (actualValue - min) / (max - min);
			console.log('p value: ', p);

			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
			} else {
				start = Math.min(p, start);
				end = p;
			}

			console.log('Start & End values: ', start, end); // <-- Logging the start and end values

			const calculatedLowHandle = (min + start * (max - min)).toFixed(2).slice(0, 3);
			const calculatedHighHandle = (min + end * (max - min)).toFixed(2).slice(0, 3);

			console.log('Calculated Handles: ', calculatedLowHandle, calculatedHighHandle); // <-- Logging the calculated handles

			lowHandle = calculatedLowHandle;
			highHandle = calculatedHighHandle;
			console.log(lowHandle, highHandle);

			handlesDragged = true; // Set the flag
		};
	}
</script>

<div>
	<!--Chart will hopefully go here -->
	<div class="relative w-full h-2 bg-gray-300" bind:this={slider}>
		<div
			class="absolute top-0 bottom-0 bg-blue-500"
			style="left: {100 * start}%; right: {100 * (1 - end)}%;"
		/>

		<div
			class="absolute top-0 bottom-0 w-4 h-4 bg-blue-600 rounded-full cursor-pointer"
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('start')}
			style="left: calc({100 * start}% - 0.5rem);"
		/>
		<div
			class="absolute top-0 bottom-0 w-4 h-4 bg-blue-600 rounded-full cursor-pointer"
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('end')}
			style="left: calc({100 * end}% - 0.5rem);"
		/>
	</div>
	<div class="flex justify-between mt-2">
		{#if lowHandle !== '0' || highHandle !== '1'}
			<div class=" p-2 border rounded">
				{lowHandle}
			</div>
			<div class="p-2 border rounded">
				{highHandle}
			</div>
		{/if}
	</div>
</div>

<style>
	.cursor-pointer:active {
		background-color: #3b82f6; /* Tailwind's blue-500 */
	}
</style>
