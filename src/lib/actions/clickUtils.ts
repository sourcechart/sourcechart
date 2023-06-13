/** Dispatch event on click outside of node */
export function clickOutside(node: Node, options: any = {}) {
	const handleClick = (event: MouseEvent) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			// @ts-ignore
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function clickInside(node: Node, options: any = {}) {
	const handleClick = (event: MouseEvent) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && node.contains(event.target as Node)) {
      //@ts-ignore
			node.dispatchEvent(new CustomEvent('click_inside', node));
		}
	};
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

export function clickEscapeKey(node: Node) {
	const handleClick = (event: KeyboardEvent) => {
		if ((node && event.key === 'Backspace') || 'Delete') {
			//@ts-ignore
			node.dispatchEvent(new CustomEvent('escapeKeyPress', node));
		}
	};
	document.addEventListener('keydown', handleClick, true);

	return {
		destroy() {
			document.addEventListener('keydown', handleClick, true);
		}
	};
}
