/**
 * Сравнивает два объекта на глубокое равенство, включая массивы (с учетом порядка).
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { a: 1, b: { c: 2 } };
 * comparison(obj1, obj2); // return: true
 *
 * @example
 * const obj3 = { a: 1, b: { c: 2 } };
 * const obj4 = { a: 1, b: { c: 3 } };
 * comparison(obj3, obj4); // return: false
 *
 * @example
 * const arr1 = [1, 2, 3];
 * const arr2 = [1, 2, 3];
 * comparison({ arr: arr1 }, { arr: arr2 }); // return: true
 *
 * @example
 * const arr3 = [1, 2, 3];
 * const arr4 = [3, 2, 1];
 * comparison({ arr: arr3 }, { arr: arr4 }); // return: false (порядок важен)
 */
const comparison = <VALUE>(prev: VALUE, next: VALUE): boolean => {
  if (prev === next) return true

  if (
    typeof prev !== "object" ||
    prev === null ||
    typeof next !== "object" ||
    next === null
  ) {
    return prev === next
  }

  if (
    Object.prototype.toString.call(prev) === "[object Map]" &&
    Object.prototype.toString.call(next) === "[object Map]"
  ) {
    return comparisonMap(prev as any, next as any)
  }

  const keysPrev = Object.keys(prev)

  if (keysPrev.length !== Object.keys(next).length) return false

  for (let key of keysPrev) {
    if (!next.hasOwnProperty(key)) return false
    const valuePrev = (prev as any)[key]
    const valueNext = (next as any)[key]

    if (Array.isArray(valuePrev) && Array.isArray(valueNext)) {
      if (valuePrev.length !== valueNext.length) {
        return false
      }
      for (let i = 0; i < valuePrev.length; i++) {
        if (!comparison(valuePrev[i], valueNext[i])) {
          return false
        }
      }
    } else if (!comparison(valuePrev, valueNext)) {
      return false
    }
  }

  return true
}

const comparisonMap = <VALUE extends Map<unknown, unknown>>(
  prev: VALUE,
  next: VALUE,
): boolean => {
  if (prev.size !== next.size) {
    return false
  }

  for (const [key, value] of prev) {
    if (!next.has(key)) {
      return false
    }
    if (!comparison(next.get(key), value)) {
      return false
    }
  }

  return true
}

export default comparison
