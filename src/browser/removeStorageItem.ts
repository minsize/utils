/** Removes a localStorage value and reports whether it succeeded. @example removeStorageItem("theme") // true */
function removeStorageItem(key: string): boolean {
  try {
    if (typeof localStorage === "undefined") return false
    localStorage.removeItem(key)
    return true
  } catch { return false }
}

export default removeStorageItem
