/** Parses a Cookie header or document.cookie into a record. @example parseCookies("theme=dark") // { theme: "dark" } */
function parseCookies(value?: string): Record<string, string> {
  const source = value ?? (typeof document === "undefined" ? "" : document.cookie)
  return source.split(";").reduce<Record<string, string>>((result, part) => {
    const index = part.indexOf("=")
    if (index < 0) return result
    const key = part.slice(0, index).trim()
    if (key) result[decodeURIComponent(key)] = decodeURIComponent(part.slice(index + 1).trim())
    return result
  }, {})
}

export default parseCookies
