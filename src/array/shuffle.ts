import random from "../number/random"
/**
 * Перемешивает элементы на месте и возвращает тот же массив.
 * Передача `seed` делает результат воспроизводимым для одного запуска.
 *
 * @example
 * shuffle([1, 2, 3], 42) // например, [2, 3, 1]
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
