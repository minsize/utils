/** Stores a JSON value in localStorage and reports whether it succeeded. @example setStorageItem("theme", "dark") // true */
function setStorageItem(key: string, value: unknown): boolean {
  try {
    if (typeof localStorage === "undefined") return false
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch { return false }
}

export default setStorageItem
