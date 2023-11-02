import * as d3 from 'd3';
import { rgb } from 'd3-color';

export enum ColorPalletes {
	BLUES = 'BLUES',
	GREENS = 'GREENS',
	REDS = 'REDS',
	ORANGES = 'ORANGES',
	PURPLES = 'PURPLES',
	GREYS = 'GREYS',
	VIRIDIS = 'VIRIDIS',
	INFERNO = 'INFERNO',
	BrBG = 'BrBG',
	PRGn = 'PRGn',
	PiYG = 'PiYG',
	PuOr = 'PuOr',
	RdBu = 'RdBu',
	RdGy = 'RdGy',
	RdYlBu = 'RdYlBu',
	RdYlGn = 'RdYlGn',
	SPECTRAL = 'SPECTRAL'
}

export class ColorScale {
	private k: number;

	constructor(k: number = 5) {
		this.k = k;
	}

	private discreteColorScale(
		interpolator: (t: number) => string,
		domain: [number, number]
	): d3.ScaleQuantize<string> {
		return d3.scaleQuantize<string>().domain(domain).range(d3.quantize(interpolator, this.k));
	}

	getColorScale(scale: ColorPalletes): d3.ScaleQuantize<string> {
		switch (scale) {
			case ColorPalletes.BLUES:
				return this.discreteColorScale(d3.interpolateBlues, [0, 100]);
			case ColorPalletes.GREENS:
				return this.discreteColorScale(d3.interpolateGreens, [0, 100]);
			case ColorPalletes.REDS:
				return this.discreteColorScale(d3.interpolateReds, [0, 100]);
			case ColorPalletes.ORANGES:
				return this.discreteColorScale(d3.interpolateOranges, [0, 100]);
			case ColorPalletes.PURPLES:
				return this.discreteColorScale(d3.interpolatePurples, [0, 100]);
			case ColorPalletes.GREYS:
				return this.discreteColorScale(d3.interpolateGreys, [0, 100]);
			case ColorPalletes.VIRIDIS:
				return this.discreteColorScale(d3.interpolateViridis, [0, 100]);
			case ColorPalletes.INFERNO:
				return this.discreteColorScale(d3.interpolateInferno, [0, 100]);
			case ColorPalletes.BrBG:
				return this.discreteColorScale(d3.interpolateBrBG, [-100, 100]);
			case ColorPalletes.PRGn:
				return this.discreteColorScale(d3.interpolatePRGn, [-100, 100]);
			case ColorPalletes.PiYG:
				return this.discreteColorScale(d3.interpolatePiYG, [-100, 100]);
			case ColorPalletes.PuOr:
				return this.discreteColorScale(d3.interpolatePuOr, [-100, 100]);
			case ColorPalletes.RdBu:
				return this.discreteColorScale(d3.interpolateRdBu, [-100, 100]);
			case ColorPalletes.RdGy:
				return this.discreteColorScale(d3.interpolateRdGy, [-100, 100]);
			case ColorPalletes.RdYlBu:
				return this.discreteColorScale(d3.interpolateRdYlBu, [-100, 100]);
			case ColorPalletes.RdYlGn:
				return this.discreteColorScale(d3.interpolateRdYlGn, [-100, 100]);
			case ColorPalletes.SPECTRAL:
				return this.discreteColorScale(d3.interpolateSpectral, [-100, 100]);
			default:
				throw new Error(`Unsupported scale: ${scale}`);
		}
	}
	getColorFromValue(scale: ColorPalletes, value: number): string {
		const colorScale = this.getColorScale(scale);
		const [min, max] = colorScale.domain();
		const clampedValue = Math.min(Math.max(value, min), max);
		return colorScale(clampedValue);
	}

	getRGBColorArray(scale: ColorPalletes): number[][] {
		const colorScale = this.getColorScale(scale);
		const colorRange = colorScale.range();
		const rgbArray = colorRange.map((colorStr) => {
			const { r, g, b } = rgb(colorStr);
			return [r, g, b];
		});
		return rgbArray;
	}
}
