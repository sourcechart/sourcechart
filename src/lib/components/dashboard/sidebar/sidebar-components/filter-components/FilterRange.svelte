<script lang="ts">
	let start: number = 0;
	let end: number = 1;
	let startValue = '0';
	let endValue = '1';
	export let min: number = 0; // Min value of the slider
	export let max: number = 100; // Max value of the slider

	let slider: HTMLElement;
	let dragging = false;

	function draggable(node: HTMLElement) {
		let x: number;

		function handleMousedown(event: MouseEvent | TouchEvent) {
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
		}

		function handleMouseup() {
			dragging = false; // Set dragging to false here

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
			let p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);

			// Convert from percentage to actual value in the range [min, max]
			let actualValue = min + p * (max - min);

			// Convert back to percentage for the visual representation
			p = (actualValue - min) / (max - min);

			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
			} else {
				start = Math.min(p, start);
				end = p;
			}

			// Log the actual values
			startValue = (min + start * (max - min)).toFixed(2).slice(0, 3);
			endValue = (min + end * (max - min)).toFixed(2).slice(0, 3);
		};
	}
</script>

<div>
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
		<div class="p-2 border rounded">
			{startValue}
			<!-- Display the minimum value -->
		</div>
		<div class="p-2 border rounded">
			{endValue}
			<!-- Display the maximum value -->
		</div>
	</div>
</div>

<style>
	.cursor-pointer:active {
		background-color: #3b82f6; /* Tailwind's blue-500 */
	}
</style>