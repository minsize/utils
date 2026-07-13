/** Reads a CSS custom property. @example getCssVariable("--brand-color") */
function getCssVariable(name: string, element?: Element): string | undefined {
  if (typeof window === "undefined" || typeof document === "undefined") return undefined
  return window.getComputedStyle(element ?? document.documentElement).getPropertyValue(name).trim() || undefined
}

export default getCssVariable
