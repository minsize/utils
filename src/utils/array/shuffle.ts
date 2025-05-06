import random from "../random"
/**
 *
 * @example
 * shuffle([1,2,3]) // return: [2,1,3]
 * shuffle([1,2,3]) // return: [3,1,2]
 */
const shuffle = <T>(array: T[], seed?: number) => {
  for (let i = array.length - 1; i > 0; i--) {
    // const j = Math.floor(Math.random() * (i + 1))
    const j = random(0, i, seed)
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default shuffle
