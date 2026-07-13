/** Checks whether an element intersects the viewport. @example isElementVisible(banner, 16) */
function isElementVisible(element: Element, offset: number = 0): boolean {
  if (typeof window === "undefined") return false
  const rect = element.getBoundingClientRect()
  return rect.bottom > offset && rect.right > offset && rect.top < window.innerHeight - offset && rect.left < window.innerWidth - offset
}

export default isElementVisible
