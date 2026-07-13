/** Scrolls an element into view only when it is outside the viewport. @example scrollIntoViewIfNeeded(errorField) */
function scrollIntoViewIfNeeded(element: Element, options: ScrollIntoViewOptions = { block: "nearest", inline: "nearest" }): boolean {
  if (typeof window === "undefined") return false
  const rect = element.getBoundingClientRect()
  if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) return false
  element.scrollIntoView(options)
  return true
}

export default scrollIntoViewIfNeeded
