/**
 * Возвращает новый массив, содержащий только уникальные элементы из исходного массива.
 * @param {T[]} array - Исходный массив.
 * @returns {T[]} - Массив уникальных элементов.
 */
function unique<T>(array: T[]): T[] {
  // Используем Set для фильтрации уникальных значений
  return Array.from(new Set(array))
}

export default unique
