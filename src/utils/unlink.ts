import isType from "./isType"

const unlink = <VALUE extends any>(value: VALUE): VALUE => {
  switch (isType(value)) {
    case "array": {
      return unlinkArray(value as any) as VALUE
    }
    case "object": {
      return unlinkObject(value as any) as VALUE
    }
    case "number": {
      return Number(String(value)) as VALUE
    }
    case "string": {
      return String(value) as VALUE
    }
    case "bigint": {
      return BigInt(String(value) as any) as VALUE
    }
    case "map": {
      return new Map(value as any) as VALUE
    }
    case "set": {
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
    newArray.push(unlink(item))
  }
  return newArray as Array[]
}

const unlinkObject = <VALUE extends Record<string, any>>(
  value: VALUE,
): VALUE => {
  const newObject: Record<string, any> = {}

  for (const key in value) {
    newObject[key] = unlink(value[key])
  }

  return newObject as VALUE
}

export default unlink
