import * as d3 from 'd3';

export enum ColorScales {
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

	getColorScale(scale: ColorScales): d3.ScaleQuantize<string> {
		switch (scale) {
			case ColorScales.BLUES:
				return this.discreteColorScale(d3.interpolateBlues, [0, 100]);
			case ColorScales.GREENS:
				return this.discreteColorScale(d3.interpolateGreens, [0, 100]);
			case ColorScales.REDS:
				return this.discreteColorScale(d3.interpolateReds, [0, 100]);
			case ColorScales.ORANGES:
				return this.discreteColorScale(d3.interpolateOranges, [0, 100]);
			case ColorScales.PURPLES:
				return this.discreteColorScale(d3.interpolatePurples, [0, 100]);
			case ColorScales.GREYS:
				return this.discreteColorScale(d3.interpolateGreys, [0, 100]);
			case ColorScales.VIRIDIS:
				return this.discreteColorScale(d3.interpolateViridis, [0, 100]);
			case ColorScales.INFERNO:
				return this.discreteColorScale(d3.interpolateInferno, [0, 100]);
			case ColorScales.BrBG:
				return this.discreteColorScale(d3.interpolateBrBG, [-100, 100]);
			case ColorScales.PRGn:
				return this.discreteColorScale(d3.interpolatePRGn, [-100, 100]);
			case ColorScales.PiYG:
				return this.discreteColorScale(d3.interpolatePiYG, [-100, 100]);
			case ColorScales.PuOr:
				return this.discreteColorScale(d3.interpolatePuOr, [-100, 100]);
			case ColorScales.RdBu:
				return this.discreteColorScale(d3.interpolateRdBu, [-100, 100]);
			case ColorScales.RdGy:
				return this.discreteColorScale(d3.interpolateRdGy, [-100, 100]);
			case ColorScales.RdYlBu:
				return this.discreteColorScale(d3.interpolateRdYlBu, [-100, 100]);
			case ColorScales.RdYlGn:
				return this.discreteColorScale(d3.interpolateRdYlGn, [-100, 100]);
			case ColorScales.SPECTRAL:
				return this.discreteColorScale(d3.interpolateSpectral, [-100, 100]);
			default:
				throw new Error(`Unsupported scale: ${scale}`);
		}
	}
	getColorFromValue(scale: ColorScales, value: number): string {
		const colorScale = this.getColorScale(scale);
		const [min, max] = colorScale.domain();
		const clampedValue = Math.min(Math.max(value, min), max);
		return colorScale(clampedValue);
	}
}
