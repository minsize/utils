import isType from "./isType"

type isArray = unknown[]
type isObject = Record<string | number | symbol, unknown>
function getChangedData<VALUE extends unknown>(
  prev: VALUE,
  next: VALUE,
): VALUE | undefined {
  switch (isType(prev)) {
    case "object": {
      return changedObject(prev as isObject, next as isObject) as VALUE
    }
    case "array": {
      return changedArray(prev as isArray, next as isArray) as VALUE
    }
    default: {
      if (prev !== next) {
        return next
      }
    }
  }

  return undefined
}

function changedObject<VALUE extends isObject>(prev: VALUE, next: VALUE) {
  const result: isObject = {}
  var isChanged = false
  for (const key in next) {
    if (prev.hasOwnProperty(key)) {
      const changed = getChangedData(prev?.[key], next?.[key])
      if (changed !== undefined) {
        result[key] = changed
        isChanged = true
      }
    } else {
      result[key] = next[key]
      isChanged = true
    }
  }

  for (const key in prev) {
    if (!(key in next)) {
      result[key] = undefined // или можно использовать специальный маркер
      isChanged = true
    }
  }

  return isChanged ? result : undefined
}

function changedArray<VALUE extends isArray>(prev: VALUE, next: VALUE) {
  const result: isArray = []
  var isChanged = false

  for (var i = 0; i < prev.length; i++) {
    const changed = getChangedData(prev?.[i], next?.[i])
    if (changed !== undefined || next?.[i] === undefined) {
      result[i] = changed
      isChanged = true
    }
  }

  for (var i = 0; i < next.length; i++) {
    const changed = getChangedData(prev?.[i], next?.[i])
    if (changed !== undefined) {
      result[i] = changed
      isChanged = true
    }
  }

  return isChanged ? result : undefined
}

export default getChangedData
