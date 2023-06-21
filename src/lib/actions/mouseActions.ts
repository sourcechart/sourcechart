/** Dispatch event on click outside of node
 *
 *  In the future, there will be a need to
 *  attach a mouse Id to each of these
 *
 *  This will also have to be explored on cell phones.
 */
import { onDestroy } from 'svelte';
import { mouseEventState } from '$lib/io/stores';
import { writable } from 'svelte/store';

export function clickOutside(node: HTMLElement, options: any = {}) {
	const handleClick = (event: MouseEvent) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function clickInside(node: HTMLElement, options: any = {}) {
	const handleClick = (event: MouseEvent) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('click_inside'));
		}
	};
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function mouseMove(node: Node, { onMove }: { onMove: (x: number, y: number) => void }) {
	let mouseStateValue: string;
	//@ts-ignore
	const handleMouseMove = (e) => {
		if (mouseStateValue === 'isHovering') {
			onMove(e.clientX, e.clientY);
		}
	};

	node.addEventListener('mousemove', handleMouseMove);

	const unsubscribe = mouseEventState.subscribe((value) => {
		mouseStateValue = value;
	});

	onDestroy(unsubscribe);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
		}
	};
}

export function touchStart(node: Node, { onStart }: { onStart: (x: number, y: number) => void }) {
	//@ts-ignore
	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		onStart(touch.clientX, touch.clientY);
		mouseEventState.set('isTouching');
	};

	node.addEventListener('touchstart', handleTouchStart);

	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouchStart);
		}
	};
}

export function touchMove(node: Node, { onMove }: { onMove: (x: number, y: number) => void }) {
	let mouseStateValue: string;
	//@ts-ignore
	const handleTouchMove = (e) => {
		if (mouseStateValue === 'isTouching') {
			const touch = e.touches[0];
			onMove(touch.clientX, touch.clientY);
		}
	};

	node.addEventListener('touchmove', handleTouchMove);

	const unsubscribe = mouseEventState.subscribe((value) => {
		mouseStateValue = value;
	});

	onDestroy(unsubscribe);

	return {
		destroy() {
			node.removeEventListener('touchmove', handleTouchMove);
		}
	};
}

export function trackMouseState(node: Node) {
	const handleMouseDown = () => {
		mouseEventState.set('isTouching');
	};

	const handleMouseUp = () => {
		mouseEventState.set('isHovering');
	};

	node.addEventListener('mousedown', handleMouseDown);
	node.addEventListener('mouseup', handleMouseUp);

	return {
		destroy() {
			node.removeEventListener('mousedown', handleMouseDown);
			node.removeEventListener('mouseup', handleMouseUp);
		}
	};
}

export function touchEnd(node: Node, { onEnd }: { onEnd: (x: number, y: number) => void }) {
	//@ts-ignore
	const handleTouchEnd = (e) => {
		if (e.changedTouches && e.changedTouches[0]) {
			const touch = e.changedTouches[0];
			onEnd(touch.clientX, touch.clientY);
		}
		mouseEventState.set('isHovering');
	};

	node.addEventListener('touchend', handleTouchEnd);

	return {
		destroy() {
			node.removeEventListener('touchend', handleTouchEnd);
		}
	};
}

export function onMouseLeave(node: Node, { onLeave }: { onLeave: () => void }) {
	const handleMouseLeave = () => {
		onLeave();
		mouseEventState.set('isHovering');
	};

	node.addEventListener('mouseleave', handleMouseLeave);

	return {
		destroy() {
			node.removeEventListener('mouseleave', handleMouseLeave);
		}
	};
}
