export const asString = (value: unknown): string => String(value);

export const asNumber = (value: unknown): number => {
  const num = Number(value);
  if (isNaN(num)) throw new Error(`Cannot convert "${value}" to a number.`);
  return num;
};

export const asBoolean = (value: unknown): boolean => {
  if (typeof value === 'undefined' || value === null) return false;
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase();
  if (str === '') return true;
  if (str === 'true') return true;
  if (str === 'false') return false;
  throw new Error(`Cannot convert "${value}" to a boolean.`);
};

export const asArrayOfStrings = (value: unknown): string[] => {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value;
  }
  throw new Error(`Cannot convert "${value}" to an array of strings.`);
};

export const asArrayNumber = (value: number | string | (number | string)[]): number[] => {
  if (typeof value === 'string') {
    // If it's a string, try to remove brackets and split by common delimiters
    return value.replace(/[\[\]]/g, '') // Remove brackets if present
      .split(/[\s,]+/) // Split by spaces or commas
      .map(item => {
        const num = Number(item);
        return !isNaN(num) ? num : null;
      })
      .filter(num => num !== null);
  }

  if (Array.isArray(value)) {
    return value.map(item => {
      const num = Number(item);
      return !isNaN(num) ? num : null;
    }).filter(num => num !== null);
  }

  if (typeof value === 'number' && !isNaN(value)) {
    return [value];
  }

  return [];
}