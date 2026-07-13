export type ColorSchemePreference = "light" | "dark" | "no-preference"

/** Returns the preferred color scheme. @example prefersColorScheme() // "dark" */
function prefersColorScheme(): ColorSchemePreference {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "no-preference"
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light"
  return "no-preference"
}

export default prefersColorScheme
