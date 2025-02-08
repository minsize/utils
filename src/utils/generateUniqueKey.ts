/**
 * Генерирует уникальный ключ для произвольного JavaScript объекта, используя хеширование (без внешних библиотек).
 *
 * @param {any} obj Произвольный JavaScript объект (string, number, array, object, итд.).
 * @returns {string} Строка, представляющая собой уникальный ключ (хеш) для переданного объекта.
 */

const generateUniqueKey = <VALUE extends any>(obj: VALUE): string => {
  const stringifyObject = (obj: VALUE): string => {
    if (
      typeof obj === "string" ||
      typeof obj === "number" ||
      typeof obj === "boolean" ||
      obj === null
    ) {
      return JSON.stringify(obj) // Для примитивов JSON.stringify достаточно.
    }

    if (Array.isArray(obj)) {
      return "[" + obj.map(stringifyObject).join(",") + "]"
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj).sort()
      let result = "{"
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        result += JSON.stringify(key) + ":" + stringifyObject((obj as any)[key])
        if (i < keys.length - 1) {
          result += ","
        }
      }
      result += "}"
      return result
    }

    // Для всего остального (функции, символы, undefined и т.д.)
    return String(obj) // Используем String() как запасной вариант
  }

  const hashCode = (str: string): number => {
    let hash = 0
    if (str.length === 0) {
      return hash
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  try {
    // Сериализуем объект в строку
    const objStr = stringifyObject(obj)

    // Генерируем хеш строки
    const hash = hashCode(objStr)

    return hash.toString(16) // Возвращаем хеш в шестнадцатеричном формате
  } catch (error) {
    console.warn(
      `Object could not be fully stringified. Using a simple string conversion. Error: ${error}`,
    )
    return hashCode(String(obj)).toString(16)
  }
}

export default generateUniqueKey
