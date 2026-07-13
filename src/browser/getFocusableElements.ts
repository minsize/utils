const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",")

/**
 * Возвращает доступные для фокуса элементы внутри контейнера.
 * Без DOM API безопасно возвращает пустой массив.
 *
 * @example
 * const focusable = getFocusableElements(dialog)
 * focusable[0]?.focus()
 */
function getFocusableElements(container?: ParentNode): HTMLElement[] {
  if (typeof document === "undefined") return []

  const root = container ?? document
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex >= 0,
  )
}

export default getFocusableElements
