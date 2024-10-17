function camelize(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
		if (+match === 0) return "";
		return index == 0 ? match.toLowerCase() : match.toUpperCase();
	});
}

export const parseValue = (original: string, value: string) => {
	if (!value) {
		return original;
	}
	if (typeof original === "number") {
		return Number.parseFloat(value);
	}
	if (typeof original === "boolean") {
		return value === "true";
	}
	if (typeof original === "string") {
		return value;
	}

	if (typeof value === "string") {
		value = JSON.parse(value);
	}

	return value;
};

export const mergeOptions = (dataset, options) => {
	const result: Record<string, unknown> = {};

	for (const key in options) {
		const camelKey = camelize(key);

		result[key] = parseValue(options[key], dataset[camelKey]?.value);
	}

	console.log({ result });


	return result;
};
