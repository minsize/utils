export type SafeAreaInsets = { top: number; right: number; bottom: number; left: number }

/** Reads CSS safe-area inset values. @example getSafeAreaInsets() // { top: 0, right: 0, bottom: 34, left: 0 } */
function getSafeAreaInsets(): SafeAreaInsets {
  if (typeof document === "undefined" || typeof window === "undefined") return { top: 0, right: 0, bottom: 0, left: 0 }
  const element = document.createElement("div")
  element.style.cssText = "position:fixed;top:env(safe-area-inset-top);right:env(safe-area-inset-right);bottom:env(safe-area-inset-bottom);left:env(safe-area-inset-left);visibility:hidden"
  document.body.appendChild(element)
  const style = window.getComputedStyle(element)
  const result = { top: parseFloat(style.top) || 0, right: parseFloat(style.right) || 0, bottom: parseFloat(style.bottom) || 0, left: parseFloat(style.left) || 0 }
  element.remove()
  return result
}

export default getSafeAreaInsets
