function camelize(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
		if (+match === 0) return "";
		return index == 0 ? match.toLowerCase() : match.toUpperCase();
	});
}


export const mergeOptions = (attributes, options) => {
	const result: Record<string, unknown> = {};

	for (const key in options) {
		const camelKey = camelize(key);

		try {
			if (attributes[camelKey]) {
				const { value } = attributes[camelKey]
				result[key] = options[key].validator(value)
			} else {
				result[key] = options[key].value
			}
		} catch (reason) {
			console.error(`Invalid value for config key "${key}".`, reason);
		}
	}

	console.log({ result });

	return result;
};
