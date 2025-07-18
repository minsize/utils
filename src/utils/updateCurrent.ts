import unique from "./array/unique"
import isType from "./isType"

type Object = Record<string | number | symbol, unknown>

function updateCurrent<CURRENT extends unknown, NEXT extends unknown>(
  current: CURRENT,
  next: NEXT,
): CURRENT {
  const type = isType(current)

  switch (type) {
    case "object": {
      return isObject(current as Object, next as Object) as CURRENT
    }
    case "array": {
      return isArray(current as unknown[], next as unknown[]) as CURRENT
    }
    default: {
      return (current ?? next) as CURRENT
    }
  }
}

function isObject<CURRENT extends Object, NEXT extends Object>(
  current: CURRENT,
  next: NEXT,
) {
  const newObject: Record<string, unknown> = {}

  const currentKeys = Object.keys(current)
  const nextKeys = Object.keys(next)

  const keys = unique([...currentKeys, ...nextKeys])

  for (const key of keys) {
    newObject[key] = updateCurrent(current[key], next[key])
  }

  return newObject
}

function isArray<CURRENT extends Array<unknown>, NEXT extends Array<unknown>>(
  current: CURRENT,
  next: NEXT,
) {
  const newArray: Array<unknown> = []

  for (var i = 0; i < current.length; i++) {
    newArray.push(updateCurrent(current?.[i], next?.[i]))
  }

  for (var i = current.length; i < next.length; i++) {
    newArray.push(updateCurrent(current?.[i], next?.[i]))
  }

  return newArray
}

export default updateCurrent
