// Определяем тип сортировки, который может быть либо по возрастанию, либо по убыванию
type SortDirection = "asc" | "desc"

/**
 * Вспомогательная функция для получения вложенных значений из объекта с использованием строки пути, используя точечную нотацию.
 * @param obj - Объект, из которого извлекаются значения.
 * @param path - Строка пути, представляющая вложенные свойства (например, "address.city").
 * @returns Значение, найденное по указанному пути, или undefined, если путь недействителен.
 */
function getNestedValue<T>(obj: T, path: string): any {
  // Разбиваем путь на части по точке и последовательно получаем доступ к вложенным свойствам
  return path
    .split(".")
    .reduce<any>(
      (acc, key) => (acc ? acc[key] : undefined),
      obj as Record<string, any>,
    )
}

// Тип, возвращающий возможные пути для доступа к свойствам объекта
type PathImpl<T, Key extends keyof T> = Key extends string
  ? // Если свойство является одним из типов объекта, строим пути рекурсивно
    T[Key] extends Record<string, any>
    ? Key | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
    : // Если нет, то возвращаем ключ как есть
      Key
  : never

// Извлечение всех возможных строк путей для объекта
type Path<T> = PathImpl<T, keyof T>

/**
 * Сортирует массив объектов по указанным вложенным ключам и направлениям.
 * @param array - Массив объектов для сортировки.
 * @param criteria - Объект, где ключи — путь к полям для сортировки (точечная нотация),
 * а значения — направления ('asc' или 'desc').
 * @returns Отсортированный массив.
 */
function orderBy<T>(
  array: T[],
  criteria: Partial<Record<Path<T>, SortDirection>>,
): T[] {
  // Получаем ключи критериев как массив путей
  const keys = Object.keys(criteria) as Array<Path<T>>

  // Сортируем массив, создавая новый массив через slice() для избежания мутаций
  return array.slice().sort((a, b) => {
    for (const key of keys) {
      // Определяем направление сортировки для текущего ключа
      const direction = criteria[key] === "desc" ? -1 : 1

      // Извлекаем значения для сравнения объектов
      const aValue = getNestedValue(a, key)
      const bValue = getNestedValue(b, key)

      // Сравниваем извлеченные значения с учетом направления
      if (aValue < bValue) return -direction
      if (aValue > bValue) return direction
    }
    // Возвращаем 0, если объекты равны по всем критериям
    return 0
  })
}

export default orderBy
