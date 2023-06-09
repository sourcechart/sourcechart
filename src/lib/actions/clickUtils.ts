/** Dispatch event on click outside of node */
export function clickOutside(node: Node, options: any = {}) {
	const handleClick = (event: Event) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			console.log("Detected click outside"); // Add console log
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
	const handleClick = (event: Event) => {
		if (options.exclude && options.exclude.contains(event.target)) {
			return;
		}
		if (node && node.contains(event.target)) {
			console.log("detected click inside")
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
	const handleClick = (event: Event) => {
		if (node && event.key === 'Backspace'||"Delete") {
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
