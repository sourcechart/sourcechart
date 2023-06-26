<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Konva from 'konva';

	let width: number;
	let height: number;
	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let transformer: Konva.Transformer;

	interface Rect {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	let rects: Rect[] = [
		{ x: 20, y: 20, width: 100, height: 100 },
		{ x: 150, y: 20, width: 100, height: 100 }
		// Add more rectangle specifications here...
	];

	onMount(() => {
		stage = new Konva.Stage({
			container: 'container', // id of container <div>
			width: window.innerWidth,
			height: window.innerHeight
		});

		layer = new Konva.Layer();
		stage.add(layer);

		rects.forEach((rect: Rect) => {
			let rectangle = new Konva.Rect({
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height,
				stroke: 'black',
				strokeWidth: 2,
				draggable: true
			});

			layer.add(rectangle);

			rectangle.on('transformend', function () {
				// transformer is changing scale of the node
				// and NOT its width or height
				// but in the end we will use that data for width and height
				var node = this;
				var scaleX = node.scaleX();
				var scaleY = node.scaleY();

				// we will reset it back
				node.scaleX(1);
				node.scaleY(1);
				node.width(Math.max(5, node.width() * scaleX));
				node.height(Math.max(node.height() * scaleY));
			});

			rectangle.on('dragstart', (e) => {
				rectangle.moveToTop();
				transformer.nodes([rectangle]);
				layer.draw();
			});

			transformer = new Konva.Transformer({
				node: rectangle,
				enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
				// set minimum width of 30px
				boundBoxFunc: function (oldBox, newBox) {
					if (newBox.width < 30 || newBox.height < 30) {
						return oldBox;
					}
					return newBox;
				}
			});

			layer.add(transformer);
		});

		stage.draw();
	});

	onDestroy(() => {
		stage.destroy();
	});
</script>

<svelte:window
	on:resize={() => {
		if (typeof window !== undefined) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
	}}
/>
