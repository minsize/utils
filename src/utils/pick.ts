/**
 *
 * @example
 * pick({ key: "1", id: "2" }, ["key"]) // return: { key: "1" }
 */
function pick<T extends object, K extends keyof T>(
  object: T,
  keys: K[],
): Pick<T, K> {
  return Object.keys(object).reduce((result, key) => {
    if (keys.includes(key as K)) {
      result[key as keyof Pick<T, K>] = (object as any)[key]
    }
    return result
  }, {} as Pick<T, K>)
}

export default pick
