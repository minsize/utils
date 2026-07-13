/** Subscribes to a media query and returns an unsubscribe function. @example const stop = createMediaQuery("(min-width: 768px)", console.log) */
function createMediaQuery(query: string, listener: (matches: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => undefined
  const media = window.matchMedia(query)
  const handler = (event: MediaQueryListEvent) => listener(event.matches)
  const legacyMedia = media as MediaQueryList & {
    addListener?: (callback: (event: MediaQueryListEvent) => void) => void
    removeListener?: (callback: (event: MediaQueryListEvent) => void) => void
  }
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }
  legacyMedia.addListener?.(handler)
  return () => legacyMedia.removeListener?.(handler)
}

export default createMediaQuery
