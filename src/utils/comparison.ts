import isType, { Type } from "./isType"

type Array = unknown[]
type Object = Record<string | number | symbol, unknown>
type Options = {
  skipCheckPrev: boolean
}

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
const distributor = <VALUE extends unknown>(prev: VALUE, next: VALUE) => {
  const type = isType(prev)

  switch (type) {
    case "array": {
      // Если не прошло проверку
      if (!isArray(prev as Array, next as Array, { skipCheckPrev: true })) {
        return false
      }
      break
    }
    case "object": {
      // Если не прошло проверку
      if (
        !isObject(prev as Object, next as Object, {
          skipCheckPrev: true,
        })
      ) {
        return false
      }
      break
    }
    case "function": {
      // Если не прошло проверку
      if (
        !isFunction(prev as Function, next as Function, {
          skipCheckPrev: true,
        })
      ) {
        return false
      }
      break
    }
    case "date": {
      // Если не прошло проверку
      if (!isDate(prev as Date, next as Date, { skipCheckPrev: true })) {
        return false
      }
      break
    }
    case "map": {
      // Если не прошло проверку
      if (
        !isMap(prev as Map<unknown, unknown>, next as Map<unknown, unknown>, {
          skipCheckPrev: true,
        })
      ) {
        return false
      }
      break
    }
    case "set": {
      if (
        !isSet(prev as Set<unknown>, next as Set<unknown>, {
          skipCheckPrev: true,
        })
      ) {
        return false
      }
      break
    }
    // case "number": {
    //   // Если не прошло проверку
    //   if (Number(`${prev}`) !== Number(`${next}`)) {
    //     return false
    //   }
    //   break
    // }
    // case "string": {
    //   // Если не прошло проверку
    //   if (String(prev) !== String(next)) {
    //     return false
    //   }
    //   break
    // }
    default: {
      // Если не прошло проверку
      if (prev !== next) {
        return false
      }
      break
    }
  }

  return true
}

function isObject<VALUE extends Object>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Object`
  if (!checkType(prev, next, "object", options)) return false

  const keysPrev = Object.keys(prev)
  const keysNext = Object.keys(next)

  // Проверка на количество ключей
  if (keysPrev.length !== keysNext.length) return false

  for (var key of keysPrev) {
    // Если в next нет ключа из prev
    if (!next.hasOwnProperty(key)) return false

    if (!distributor(prev[key], next[key])) {
      return false
    }
  }

  return true
}

function isArray<VALUE extends Array>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Array`
  if (!checkType(prev, next, "array", options)) return false

  // Если prev или next имеют разную длину
  if (prev.length !== next.length) return false

  for (var i = 0; i < prev.length; i++) {
    if (!distributor(prev[i], next[i])) {
      return false
    }
  }

  return true
}

function isFunction<VALUE extends Function>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Function`
  if (!checkType(prev, next, "function", options)) return false

  return prev === next
}

function isDate<VALUE extends Date>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Date`
  if (!checkType(prev, next, "date", options)) return false

  return prev.getTime() === next.getTime()
}

function isMap<VALUE extends Map<unknown, unknown>>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Map`
  if (!checkType(prev, next, "map", options)) return false

  // Если prev или next имеют разную длину
  if (prev.size !== next.size) return false

  for (const [key, value] of prev) {
    if (!distributor(value, next.get(key))) {
      return false
    }
  }

  return true
}

function isSet<VALUE extends Set<unknown>>(
  prev: VALUE,
  next: VALUE,
  options?: Options,
) {
  // Если prev или next не `Set`
  if (!checkType(prev, next, "set", options)) return false

  // Если prev или next имеют разную длину
  if (prev.size !== next.size) return false

  const keysPrev = Array.from(prev.keys())
  const keysNext = Array.from(next.keys())
  for (var i = 0; i < keysPrev.length; i++) {
    if (!distributor(keysPrev[i], keysNext[i])) {
      return false
    }
  }
  return true
}

function checkType(
  prev: unknown,
  next: unknown,
  type: Type,
  options?: Options,
) {
  if ((!options?.skipCheckPrev && !isType(prev, type)) || !isType(next, type))
    return false

  return true
}

export default distributor
