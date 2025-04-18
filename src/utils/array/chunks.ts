/**
 *
 * @example
 * chunks(2, [1,2,3,4]) // [[1,2], [3,4]]
 */
export const chunks = <T>(count: number, array: T[]): T[][] => {
  const arr = []
  for (let i = 0; i < array.length; i += count) {
    arr.push(array.slice(i, i + count))
  }
  return arr
}

export default chunks
