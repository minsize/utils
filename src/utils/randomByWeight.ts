import random from "./random"

/**
 * Функция для выбора случайного элемента из объекта items на основе весов, с возможностью использования seed для случайности.
 * @template Items
 * @param {Items} items - Объект, представляющий элементы и их веса.
 * @param {number} [seed] - Необязательное значение для начального состояния генерации случайных чисел.
 * @returns {string} Выбор случайного элемента на основе указанных весов.
 */
function randomByWeight<Items extends Record<string, number>>(
  items: Items,
  seed?: number,
) {
  let totalWeight = 0

  // Вычисление общей суммы весов всех элементов в объекте.
  for (const item in items) {
    totalWeight += items[item]
  }

  // Генерация случайного числа в диапазоне [0, totalWeight) с использованием seed при наличии.
  const randomNum = random(0, totalWeight, seed)

  let accumulatedWeight = 0

  // Проход по объекту items для определения, какой элемент выбрать на основе сгенерированного случайного числа.
  for (const item in items) {
    accumulatedWeight += items[item]
    if (randomNum < accumulatedWeight) {
      return item
    }
  }

  // В случае непредвиденной ошибки возвращаем случайный элемент из items.
  const keys = Object.keys(items)
  return keys[random(0, keys.length - 1, seed)] as Extract<keyof Items, string>
}

export default randomByWeight
