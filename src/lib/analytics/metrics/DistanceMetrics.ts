private euclideanDistance(p: Point, q: Point): number {
	let sum = 0;
	let i = Math.min(p.length, q.length);

	while (i--) {
		sum += (p[i] - q[i]) * (p[i] - q[i]);
	}

	return Math.sqrt(sum);
}
private gowerDistance(p: (number | string)[], q: (number | string)[]): number {
	let sum = 0;
	let validDimensions = 0;

	for (let i = 0; i < p.length; i++) {
		if (p[i] !== null && q[i] !== null) {
			if (typeof p[i] === 'number' && typeof q[i] === 'number') {
				const max = Math.max(
					//@ts-ignore
					...p.filter((x) => typeof x === 'number'),
					...q.filter((x) => typeof x === 'number')
				);
				const min = Math.min(
					//@ts-ignore
					...p.filter((x) => typeof x === 'number'),
					...q.filter((x) => typeof x === 'number')
				);
				sum += Math.abs((p[i] as number) - (q[i] as number)) / (max - min);
			} else if (typeof p[i] === 'string' && typeof q[i] === 'string') {
				sum += p[i] === q[i] ? 0 : 1;
			}
			validDimensions++;
		}
	}

	return sum / validDimensions;
}
