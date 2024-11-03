const toShort = (number: number, customParts?: string[], fixed: number = 1) => {
  const parts = customParts || ["", "k", "M", "G", "T", "P"]
  const isNegative = number < 0
  const positive = Math.abs(number)
  const index = (Math.log10(positive) / 3) | 0
  const scale = 10 ** (index * 3)
  const result = positive / scale
  return (
    parseFloat(
      `${isNegative ? "-" : ""}${
        result % 1 ? (Math.floor(result * 10) / 10).toFixed(fixed) : result
      }`,
    ) + parts[index]
  )
}

export default toShort
