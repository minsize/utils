type isType =
  | "[object Object]"
  | "[object Array]"
  | "[object String]"
  | "[object Number]"
  | "[object BigInt]"
  | "[object Map]"
  | "[object Set]"
const isType = <T>(item: T) => {
  return Object.prototype.toString.call(item) as isType
}

const unlinkOther = <VALUE extends unknown>(
  value: VALUE,
  type?: isType,
): VALUE => {
  switch (type || isType(type)) {
    case "[object Number]": {
      return Number(String(value)) as VALUE
    }
    case "[object String]": {
      return String(value) as VALUE
    }
    case "[object BigInt]": {
      return BigInt(String(value) as any) as VALUE
    }
    case "[object Map]": {
      return new Map(value as any) as VALUE
    }
    case "[object Set]": {
      return new Set(value as any) as VALUE
    }
    default: {
      return value
    }
  }
}

const unlinkArray = <Array extends unknown>(array: Array[]): Array[] => {
  const newArray = []

  for (const item of array) {
    const type = isType(item)
    if (type === "[object Array]") {
      newArray.push(unlinkArray(item as Array[]))
    } else if (type === "[object Object]") {
      newArray.push(unlinkObject(item as any))
    } else {
      newArray.push(unlinkOther(item))
    }
  }
  return newArray as Array[]
}

const unlinkObject = <VALUE extends Record<string, any>>(
  value: VALUE,
): VALUE => {
  const newObject: Record<string, any> = {}

  const keys = Object.keys(value)
  for (const key of keys) {
    const type = isType(value[key])
    if (type === "[object Array]") {
      newObject[key] = unlinkArray(value[key])
    } else if (type === "[object Object]") {
      newObject[key] = unlinkObject(value[key])
    } else {
      newObject[key] = value[key]
    }
  }

  return newObject as VALUE
}

const unlink = <VALUE extends any>(value: VALUE): VALUE => {
  switch (isType(value)) {
    case "[object Array]": {
      return unlinkArray(value as any) as VALUE
    }
    case "[object Object]": {
      return unlinkObject(value as any) as VALUE
    }
    default: {
      return unlinkOther(value)
    }
  }
}

export default unlink
