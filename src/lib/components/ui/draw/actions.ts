export function mouseTracker(
	node: HTMLElement | HTMLCanvasElement,
	{ onMove }: { onMove: (x: number, y: number) => void }
) {
	console.log('action attached');

	return {
		destroy() {
			console.log('action destroyed');
		}
	};
}
/*
export function touchTracker(node: Node, { onTouch }: { onTouch: (x: number, y: number) => void }) {
	//@ts-expect-error
	const handleTouch = (event) => {
		const { clientX, clientY } = event.touches[0];
		onTouch(clientX, clientY);
	};
	node.addEventListener('touchstart', handleTouch);
	return {
		destroy() {
			node.removeEventListener('touchstart', handleTouch);
		}
	};
}
*/
