/**
 *
 * @example
 * alignTo(1, 4) // return: 4
 * alignTo(3, 4) // return: 4
 * alignTo(5, 4) // return: 8
 * alignTo(9, 4) // return: 12
 */
function alignTo(num: number, by: number) {
  return num <= 0 ? by : num + ((by - (num % by)) % by)
}

export default alignTo
