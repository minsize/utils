/**
 * Разбирает строку запроса URL и возвращает объект с параметрами запроса.
 * @param {string} queryString - Строка запроса, начинающаяся с '?'.
 * @returns {Record<string, string>} - Объект, представляющий параметры запроса и их значения.
 *
 * @example
 * parseQueryString("?page=2&filter=new") // { page: "2", filter: "new" }
 */
function parseQueryString<Result extends Record<string, string>>(
  queryString: string,
): Result {
  const params: Record<string, string> = {}

  // Удаляем '?' в начале строки, если он есть
  const query = queryString.startsWith("?") ? queryString.slice(1) : queryString

  for (const [key, value] of new URLSearchParams(query)) {
    params[key] = value
  }

  return params as Result
}

export default parseQueryString
