import { OptionRecord, Options } from "../schema";

function camelize(str: string) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
		if (+match === 0) return "";
		return index == 0 ? match.toLowerCase() : match.toUpperCase();
	});
}


export const mergeOptions = (
	attributes: NamedNodeMap,
	options: OptionRecord<Options>
) => {
	const result: Record<string, unknown> = {};

	for (const key in options) {
		const camelKey = camelize(key);

		try {
			// @ts-ignore
			if (attributes[camelKey]) {
				// @ts-ignore
				const { value } = attributes[camelKey]
				// @ts-ignore
				result[key] = options[key].validator(value)
			} else {
				// @ts-ignore
				result[key] = options[key].value
			}
		} catch (reason) {
			console.error(`Invalid value for config key "${key}".`, reason);
		}
	}

	return result;
};
