export const promiseMap = async <T, U>(
	items: T[],
	fn: (item: T) => Promise<U> | U,
	{ concurrency = 1 },
): Promise<U[]> => {
	return new Promise<U[]>((resolve, reject) => {
		if (!items || items.length < 1) {
			return resolve([]);
		}

		const stack = items.slice(0); // clone the incoming array
		const results: U[] = [];
		let pending = 0;
		let rejected = false;
		const next = async (): Promise<void> => {
			if (!stack.length || pending >= concurrency) return;
			pending++;
			const item = stack.pop();
			try {
				if (item) {
					const result = await fn(item);
					results.push(result);
				}
				pending--;
			} catch (e) {
				rejected = true;
				console.log(e);
				return reject(e);
			}
			if (rejected) return;
			if (stack.length === 0 && pending === 0) {
				resolve(results);
			} else {
				next();
			}
		};
		for (let i = 0; i < concurrency; i++) {
			next();
		}
	});
};
