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
	private currentDomain: [number, number];

	constructor(k: number = 5) {
		this.k = k;
		this.currentDomain = [0, 100]; // Default domain
	}

	private discreteColorScale(interpolator: (t: number) => string): d3.ScaleQuantize<string> {
		return d3
			.scaleQuantize<string>()
			.domain(this.currentDomain) // Use the stored domain
			.range(d3.quantize(interpolator, this.k));
	}

	getColorScale(scale: ColorPalletes): d3.ScaleQuantize<string> {
		switch (scale) {
			case ColorPalletes.BLUES:
				return this.discreteColorScale(d3.interpolateBlues);
			case ColorPalletes.GREENS:
				return this.discreteColorScale(d3.interpolateGreens);
			case ColorPalletes.REDS:
				return this.discreteColorScale(d3.interpolateReds);
			case ColorPalletes.ORANGES:
				return this.discreteColorScale(d3.interpolateOranges);
			case ColorPalletes.PURPLES:
				return this.discreteColorScale(d3.interpolatePurples);
			case ColorPalletes.GREYS:
				return this.discreteColorScale(d3.interpolateGreys);
			case ColorPalletes.VIRIDIS:
				return this.discreteColorScale(d3.interpolateViridis);
			case ColorPalletes.INFERNO:
				return this.discreteColorScale(d3.interpolateInferno);
			case ColorPalletes.BrBG:
				return this.discreteColorScale(d3.interpolateBrBG);
			case ColorPalletes.PRGn:
				return this.discreteColorScale(d3.interpolatePRGn);
			case ColorPalletes.PiYG:
				return this.discreteColorScale(d3.interpolatePiYG);
			case ColorPalletes.PuOr:
				return this.discreteColorScale(d3.interpolatePuOr);
			case ColorPalletes.RdBu:
				return this.discreteColorScale(d3.interpolateRdBu);
			case ColorPalletes.RdGy:
				return this.discreteColorScale(d3.interpolateRdGy);
			case ColorPalletes.RdYlBu:
				return this.discreteColorScale(d3.interpolateRdYlBu);
			case ColorPalletes.RdYlGn:
				return this.discreteColorScale(d3.interpolateRdYlGn);
			case ColorPalletes.SPECTRAL:
				return this.discreteColorScale(d3.interpolateSpectral);
			default:
				throw new Error(`Unsupported scale: ${scale}`);
		}
	}

	public updateDomain(newDomain: [number, number]): void {
		this.currentDomain = newDomain;
	}

	getColorFromValue(scale: ColorPalletes, value: number): string {
		const colorScale = this.getColorScale(scale);
		const [min, max] = colorScale.domain();
		const clampedValue = Math.min(Math.max(value, min), max);
		return colorScale(clampedValue);
	}

	getRGBColorArray(scale: ColorPalletes) {
		const colorScale = this.getColorScale(scale);
		const colorRange = colorScale.range();
		const rgbArray = colorRange.map((colorStr) => {
			const { r, g, b } = rgb(colorStr);
			return [r, g, b];
		});
		return rgbArray;
	}
}
