export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalTerms: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalTerms[key] = obj[key];
    }
  }
  return finalTerms;
};