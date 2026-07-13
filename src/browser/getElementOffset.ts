export type ElementOffset = { top: number; left: number }

/** Returns an element position relative to the document. @example getElementOffset(button) // { top: 120, left: 20 } */
function getElementOffset(element: Element): ElementOffset {
  const rect = element.getBoundingClientRect()
  return { top: rect.top + (typeof window === "undefined" ? 0 : window.scrollY), left: rect.left + (typeof window === "undefined" ? 0 : window.scrollX) }
}

export default getElementOffset
