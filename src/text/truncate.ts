/** Truncates text without exceeding the requested length. @example truncate("Hello world", 8) // "Hello..." */
function truncate(value: string, maxLength: number, suffix: string = "..."): string {
  if (!Number.isInteger(maxLength) || maxLength < 0) throw new RangeError("Max length must be a non-negative integer.")
  if (value.length <= maxLength) return value
  if (maxLength <= suffix.length) return suffix.slice(0, maxLength)
  return value.slice(0, maxLength - suffix.length) + suffix
}

export default truncate
