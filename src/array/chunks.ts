/**
 * Разбивает массив на последовательные части указанного размера.
 *
 * @example
 * chunks(2, [1, 2, 3, 4, 5]) // [[1, 2], [3, 4], [5]]
 */
export const chunks = <T>(count: number, array: T[]): T[][] => {
  if (!Number.isInteger(count) || count <= 0) {
    throw new RangeError("Chunk size must be a positive integer.")
  }

  const arr = []
  for (let i = 0; i < array.length; i += count) {
    arr.push(array.slice(i, i + count))
  }
  return arr
}

export default chunks
