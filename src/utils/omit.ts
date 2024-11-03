/**
 *
 * @example
 * omit({ key: "1", id: "2" }, ["key"]) // return: { key: "1" }
 */
function omit<T extends object, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> {
  return Object.keys(object).reduce((result, key) => {
    if (!keys.includes(key as K)) {
      result[key as keyof Omit<T, K>] = (object as any)[key]
    }
    return result
  }, {} as Omit<T, K>)
}

export default omit
