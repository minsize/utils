/**
 * Проверяет наличие DOM API. Подходит для защиты кода при SSR.
 *
 * @example
 * if (isBrowser()) window.scrollTo(0, 0)
 */
const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined"

export default isBrowser
