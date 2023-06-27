import * as echarts from 'echarts';

export type EChartsOptions = echarts.EChartsOption;
export type EChartsTheme = string | object;
export type EChartsRenderer = 'canvas' | 'svg';

export type ChartOptions = {
	theme?: EChartsTheme;
	renderer?: EChartsRenderer;
	options: EChartsOptions;
};

const DEFAULT_OPTIONS: Partial<ChartOptions> = {
	theme: undefined,
	renderer: 'canvas'
};

export function chartable(element: HTMLElement, echartOptions: ChartOptions) {
	const { theme, renderer, options } = {
		...DEFAULT_OPTIONS,
		...echartOptions
	};
	const echartsInstance = echarts.init(element, theme, { renderer });
	echartsInstance.setOption(options);

	const resizeObserver = new ResizeObserver(() => {
		echartsInstance.resize();
	});

	resizeObserver.observe(element);

	return {
		destroy() {
			echartsInstance.dispose();
			resizeObserver.disconnect();
		},
		update(newOptions: ChartOptions) {
			echartsInstance.setOption({
				...echartOptions.options,
				...newOptions.options
			});
		}
	};
}

export let options: EChartsOptions;
export let { theme, renderer } = DEFAULT_OPTIONS;
