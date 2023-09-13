<script lang="ts">
	import { allCharts, clickedChartIndex } from '$lib/io/Stores';
	export let column: string;
	export let min: number; // Min value of the slider
	export let max: number; // Max value of the slider

	let slider: HTMLElement;
	let dragging = false;
	let start: number;
	let end: number;

	export let prevData: any;
	export let lowHandle: string;
	export let highHandle: string;

	let handlesDragged = false;
	if (prevData) {
		start = (Number(prevData.min) - min) / (max - min);
		end = (Number(prevData.max) - min) / (max - min);
	} else {
		start = 0;
		end = 1;
	}

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

	function syncHandlesWithStartEnd() {
		const calculatedLowHandle = (min + start * (max - min)).toFixed(2).slice(0, 3);
		const calculatedHighHandle = (min + end * (max - min)).toFixed(2).slice(0, 3);

		lowHandle = calculatedLowHandle;
		highHandle = calculatedHighHandle;
	}

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

	function updateHandlePositions(newStart, newEnd) {
		start = newStart;
		end = newEnd;

		const calculatedLowHandle = (min + start * (max - min)).toFixed(2).slice(0, 3);
		const calculatedHighHandle = (min + end * (max - min)).toFixed(2).slice(0, 3);

		lowHandle = calculatedLowHandle;
		highHandle = calculatedHighHandle;

		handlesDragged = true;
	}

	function setHandlePosition(which: 'start' | 'end') {
		return function (evt: CustomEvent) {
			const { left, right } = slider.getBoundingClientRect();
			const parentWidth = right - left;
			var p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
			var actualValue = min + p * (max - min);
			p = (actualValue - min) / (max - min);

			let newStart = start;
			let newEnd = end;

			if (which === 'start') {
				newStart = p;
				newEnd = Math.max(end, p);
			} else {
				newStart = Math.min(p, start);
				newEnd = p;
			}

			updateHandlePositions(newStart, newEnd);
		};
	}
</script>

<div>
	<!--Chart will hopefully go here -->
	<div class="relative w-full h-4 bg-gray-300 rounded" bind:this={slider}>
		<div
			class="absolute top-0 bottom-0 bg-blue-500 rounded"
			style="left: {100 * start}%; right: {100 * (1 - end)}%;"
		/>

		<div
			class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full cursor-pointer shadow-md"
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('start')}
			style="left: calc({100 * start}% - 0.75rem);"
		/>
		<div
			class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-600 rounded-full cursor-pointer shadow-md"
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('end')}
			style="left: calc({100 * end}% - 0.75rem);"
		/>
	</div>
	<div class="flex justify-between mt-2 text-gray-400">
		{#if lowHandle !== '0' || highHandle !== '1'}
			<div class="p-2 border rounded shadow-sm">
				{lowHandle}
			</div>
			<div class="p-2 border rounded shadow-sm">
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
