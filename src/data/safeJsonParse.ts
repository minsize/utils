/**
 * Разбирает JSON и возвращает fallback вместо исключения при невалидных данных.
 *
 * @example
 * safeJsonParse<{ page: number }>("{\"page\":2}") // { page: 2 }
 * safeJsonParse("invalid", null) // null
 */
function safeJsonParse<T>(value: string): T | undefined
function safeJsonParse<T>(value: string, fallback: T): T
function safeJsonParse<T>(value: string, fallback?: T): T | undefined {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export default safeJsonParse
