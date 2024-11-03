type Type =
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

const actions: Record<Type, (value: unknown) => boolean> = {
  date: (value) => value instanceof Date,
  regexp: (value) => value instanceof RegExp,
  error: (value) => value instanceof Error,
  map: (value) => value instanceof Map,
  set: (value) => value instanceof Set,
  weakmap: (value) => value instanceof WeakMap,
  weakset: (value) => value instanceof WeakSet,
  promise: (value) => value instanceof Promise,
  buffer: (value) => value instanceof Buffer,
  undefined: (value) => typeof value === "undefined",
  string: (value) => typeof value === "string",
  bigint: (value) => typeof value === "bigint",
  number: (value) => typeof value === "number" && !isNaN(value),
  nan: (value) => typeof value === "number" && isNaN(value),
  boolean: (value) => typeof value === "boolean",
  array: (value) => Array.isArray(value),
  object: (value) =>
    typeof value === "object" && !Array.isArray(value) && value !== null,
  function: (value) => typeof value === "function",
  null: (value) => value === null,
  symbol: (value) => typeof value === "symbol",
  unknown: () => true,
}
/**
 *
 * @example
 * isType({}) // return: "object"
 * isType({}, "object") // return: true
 */
function isType<Value>(value: Value, _type: Type): boolean
function isType<Value>(value: Value): Type

function isType<Value>(value: Value, _type?: Type) {
  for (const [type, check] of Object.entries(actions)) {
    if (check(value)) {
      if (_type !== undefined) {
        return type === _type
      }
      return type
    }
  }
  return _type !== undefined ? false : "unknown"
}

export default isType
