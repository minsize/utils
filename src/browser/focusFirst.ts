import getFocusableElements from "./getFocusableElements"

/** Focuses the first focusable child. @example focusFirst(dialog) */
function focusFirst(container: ParentNode): HTMLElement | undefined {
  const element = getFocusableElements(container)[0]
  element?.focus()
  return element
}

export default focusFirst
