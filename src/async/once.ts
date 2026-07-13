/**
 * Возвращает обёртку, которая вызывает исходную функцию только при первом вызове.
 * Повторные вызовы возвращают результат первого.
 *
 * @example
 * const initialize = once(() => "ready")
 * initialize() // "ready"
 * initialize() // "ready"; исходная функция больше не запускается
 */
function once<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> {
  let called = false
  let result: ReturnType<T>

  return function (...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true
      result = fn(...args)
      return result
    }
    return result
  }
}

export default once
