import getFocusableElements from "./getFocusableElements"

/** Focuses the last focusable child. @example focusLast(dialog) */
function focusLast(container: ParentNode): HTMLElement | undefined {
  const elements = getFocusableElements(container)
  const element = elements[elements.length - 1]
  element?.focus()
  return element
}

export default focusLast
