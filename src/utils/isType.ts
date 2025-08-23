export type Type =
  | "string"
  | "number"
  | "bigint"
  | "nan"
  | "boolean"
  | "object"
  | "array"
  | "function"
  | "null"
  | "undefined"
  | "symbol"
  | "date"
  | "regexp"
  | "error"
  | "unknown"
  | "map"
  | "set"
  | "weakmap"
  | "weakset"
  | "promise"
  | "buffer"

/**
 *
 * @example
 * isType({}) // return: "object"
 * isType({}, "object") // return: true
 */
function isType<Value>(value: Value, type: Type): boolean
function isType<Value>(value: Value): Type

function isType<Value>(value: Value, type?: Type) {
  var __prototype = Object.prototype.toString
    .call(value)
    .replace("[object ", "")
    .replace("]", "")
    .toLowerCase()

  try {
    if (__prototype === "number") {
      if (isNaN(value as number)) {
        __prototype = "nan"
      }
    } else if (value instanceof Buffer) {
      __prototype = "buffer"
    }
  } catch {}

  // Жёсткая проверка на тип
  if (type !== undefined) {
    return __prototype === type
  }

  return __prototype
}

export default isType
