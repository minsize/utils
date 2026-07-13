/** Finds the nearest scrollable parent. @example getScrollParent(menu) */
function getScrollParent(element: HTMLElement): HTMLElement | null {
  if (typeof window === "undefined") return null
  for (let parent = element.parentElement; parent; parent = parent.parentElement) {
    const style = window.getComputedStyle(parent)
    if (/(auto|scroll|overlay)/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)) return parent
  }
  return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null
}

export default getScrollParent
