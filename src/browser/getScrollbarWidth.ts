/** Returns the current vertical scrollbar width. @example getScrollbarWidth() // 15 */
const getScrollbarWidth = (): number =>
  typeof window === "undefined" || typeof document === "undefined" ? 0 : Math.max(0, window.innerWidth - document.documentElement.clientWidth)

export default getScrollbarWidth
