/**
 * Группирует элементы массива по заданному критерию.
 * @param {T[]} array - Массив элементов, которые нужно сгруппировать.
 * @param {(item: T) => K} keyGetter - Функция, определяющая ключ группы для каждого элемента.
 * @returns {Record<string, T[]>} - Объект, где ключами являются результаты keyGetter, а значениями — массивы элементов.
 */
function groupBy<T, K extends string | number>(
  array: T[],
  keyGetter: (item: T) => K,
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyGetter(item) // Получаем ключ группы для текущего элемента

    // Если ключа еще нет в результирующем объекте, создаем массив
    if (!result[key]) {
      result[key] = []
    }

    // Добавляем элемент в соответствующую группу
    result[key].push(item)

    return result
  }, {} as Record<K, T[]>)
}

export default groupBy
