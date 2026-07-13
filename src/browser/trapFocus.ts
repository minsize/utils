import getFocusableElements from "./getFocusableElements"

/** Keeps Tab navigation inside a container and returns a cleanup function. @example const release = trapFocus(dialog) */
function trapFocus(container: HTMLElement): () => void {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab" || typeof document === "undefined") return
    const elements = getFocusableElements(container)
    if (!elements.length) return
    const first = elements[0]
    const last = elements[elements.length - 1]
    const current = document.activeElement
    if (event.shiftKey ? current === first || !container.contains(current) : current === last || !container.contains(current)) {
      event.preventDefault()
      ;(event.shiftKey ? last : first).focus()
    }
  }
  container.addEventListener("keydown", onKeyDown)
  return () => container.removeEventListener("keydown", onKeyDown)
}

export default trapFocus
