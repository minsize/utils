/** Sets a CSS custom property. @example setCssVariable("--brand-color", "rebeccapurple") */
function setCssVariable(name: string, value: string, element?: HTMLElement): boolean {
  if (typeof document === "undefined") return false
  ;(element ?? document.documentElement).style.setProperty(name, value)
  return true
}

export default setCssVariable
