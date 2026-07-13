export type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  expires?: Date
  sameSite?: "lax" | "strict" | "none"
  secure?: boolean
}

/** Sets a browser cookie and returns whether document.cookie is available. @example setCookie("theme", "dark", { path: "/" }) */
function setCookie(name: string, value: string, options: CookieOptions = {}): boolean {
  if (typeof document === "undefined") return false
  const attributes = [
    options.path && `Path=${options.path}`,
    options.domain && `Domain=${options.domain}`,
    options.maxAge !== undefined && `Max-Age=${Math.floor(options.maxAge)}`,
    options.expires && `Expires=${options.expires.toUTCString()}`,
    options.sameSite && `SameSite=${options.sameSite}`,
    options.secure && "Secure",
  ].filter(Boolean)
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${attributes.length ? `; ${attributes.join("; ")}` : ""}`
  return true
}

export default setCookie
