import { initialConfiguration } from '../../configuration';

export const normalizeConfigValue = (
  key: keyof typeof initialConfiguration,
  value: unknown,
) => {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }

  try {
    if (typeof initialConfiguration[key] === 'boolean') {
      if (typeof value === 'undefined' || value === null) return false;
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === '') return true;
      if (value === 'false') return false;
    } else if (typeof initialConfiguration[key] === 'number') {
      if (typeof value === 'string') {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
          return parsedValue;
        }
      }
    } else if (typeof initialConfiguration[key] === 'string') {
      if (typeof value === 'string') {
        return value;
      }
    } else if (typeof initialConfiguration[key] === 'object') {
      if (typeof value === 'object') {
        return value;
      }
    }
    return value;
  } catch (error) {
    console.error(`Error normalizing config value for key ${key}:`, error);
    return initialConfiguration[key];
  }
};
