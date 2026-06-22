const toCamelCase = (value: string) =>
  value.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());

export const camelizeKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(camelizeKeys);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>((result, [key, entry]) => {
    result[toCamelCase(key)] = camelizeKeys(entry);
    return result;
  }, {});
};
