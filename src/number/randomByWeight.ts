import random from "./random"

/**
 * Функция для выбора случайного элемента из объекта items на основе весов, с возможностью использования seed для случайности.
 * @template Items
 * @param {Items} items - Объект, представляющий элементы и их веса.
 * @param {number} [seed] - Необязательное значение для начального состояния генерации случайных чисел.
 * @returns {string} Выбор случайного элемента на основе указанных весов.
 *
 * @example
 * randomByWeight({ common: 80, rare: 20 }, 42) // "common" или "rare"
 */
function randomByWeight<Items extends Record<string, number>>(
  items: Items,
  seed?: number,
) {
  const entries = Object.entries(items) as Array<
    [Extract<keyof Items, string>, number]
  >

  if (entries.length === 0) {
    throw new RangeError("At least one weighted item is required.")
  }

  let totalWeight = 0

  for (const [, weight] of entries) {
    if (!Number.isFinite(weight) || weight < 0) {
      throw new RangeError("Weights must be finite non-negative numbers.")
    }

    totalWeight += weight
  }

  if (totalWeight === 0) {
    throw new RangeError("At least one weight must be greater than zero.")
  }

  const randomNum =
    (random(0, 2 ** 32 - 1, seed) / 2 ** 32) * totalWeight

  let accumulatedWeight = 0

  for (const [item, weight] of entries) {
    accumulatedWeight += weight
    if (randomNum < accumulatedWeight) {
      return item
    }
  }

  return entries[entries.length - 1][0]
}

export default randomByWeight
