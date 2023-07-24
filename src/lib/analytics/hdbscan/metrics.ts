export function euclidean(a: Array<number>, b: Array<number>): number {
	var sum = 0;
	for (var n = 0; n < a.length; n++) {
		sum += Math.pow(a[n] - b[n], 2);
	}
	return Math.sqrt(sum);
}

export function gower(arr1: (number | string)[], arr2: (number | string)[]): number {
	let sum = 0;
	let count = 0;

	const isNumeric = (n: any): boolean => {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};

	const scaledDifference = (num1: number, num2: number, min: number, max: number): number => {
		if (isNaN(num1) || isNaN(num2)) {
			return 0;
		} else {
			return Math.abs(num1 - num2) / (max - min);
		}
	};

	const dissimilarity = (cat1: string, cat2: string): number => {
		return cat1 === cat2 ? 0 : 1;
	};

	for (let i = 0; i < arr1.length; i++) {
		if (isNumeric(arr1[i]) && isNumeric(arr2[i])) {
			sum += scaledDifference(Number(arr1[i]), Number(arr2[i]), 0, 1);
			count++;
		} else if (!isNumeric(arr1[i]) && !isNumeric(arr2[i])) {
			sum += dissimilarity(String(arr1[i]), String(arr2[i]));
			count++;
		}
	}

	return count === 0 ? 0 : sum / count;
}
