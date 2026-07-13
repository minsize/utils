/**
 * Форматирует размер в байтах в компактную строку с бинарным суффиксом.
 *
 * @example
 * formatBytes(1536) // "1.5 KB"
 */
function formatBytes(bytes: number, fractionDigits: number = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError("Bytes must be a finite non-negative number.")
  }

  if (!Number.isInteger(fractionDigits) || fractionDigits < 0) {
    throw new RangeError("Fraction digits must be a non-negative integer.")
  }

  if (bytes === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"]
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** exponent
  const formattedValue = Number(value.toFixed(fractionDigits))

  return `${formattedValue} ${units[exponent]}`
}

export default formatBytes
