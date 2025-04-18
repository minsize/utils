/**
 * Разбирает строку запроса URL и возвращает объект с параметрами запроса.
 * @param {string} queryString - Строка запроса, начинающаяся с '?'.
 * @returns {Record<string, string>} - Объект, представляющий параметры запроса и их значения.
 */
function parseQueryString<Result extends Record<string, string>>(
  queryString: string,
): Result {
  const params: Record<string, string> = {}

  // Удаляем '?' в начале строки, если он есть
  const query = queryString.startsWith("?") ? queryString.slice(1) : queryString

  // Разделяем строку на отдельные параметры
  const pairs = query.split("&")

  for (const pair of pairs) {
    // Разделяем каждый параметр на ключ и значение
    const [key, value] = pair.split("=")
    if (key) {
      // Декодируем ключ и значение, так как они могут быть URL-кодированными
      const decodedKey = decodeURIComponent(key)
      const decodedValue = value ? decodeURIComponent(value) : ""

      // Добавляем в объект
      params[decodedKey] = decodedValue
    }
  }

  return params as Result
}

export default parseQueryString
