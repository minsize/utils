import safeJsonParse from "../data/safeJsonParse"

const getStorage = (): Storage | undefined => {
  try { return typeof localStorage === "undefined" ? undefined : localStorage } catch { return undefined }
}

/** Reads a JSON value from localStorage without throwing during SSR or quota errors. @example getStorageItem("theme", "light") */
function getStorageItem<T>(key: string): T | undefined
function getStorageItem<T>(key: string, fallback: T): T
function getStorageItem<T>(key: string, fallback?: T): T | undefined {
  try {
    const value = getStorage()?.getItem(key)
    return value === null || value === undefined ? fallback : safeJsonParse(value, fallback)
  } catch { return fallback }
}

export default getStorageItem
