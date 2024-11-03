/**
 *
 * @example
 * clamp(10, 1, 10) // return: 10
 * clamp(0, 1, 10) // return: 1
 * clamp(11, 1, 10) // return: 10
 */
const clamp = (value: number, min: number, max: number) =>
  value > min ? (value < max ? value : max) : min

export default clamp
