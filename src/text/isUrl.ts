/** Checks whether a value is an absolute HTTP(S) URL. @example isUrl("https://example.com") // true */
const isUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export default isUrl
