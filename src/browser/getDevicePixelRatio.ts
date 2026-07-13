/** Returns devicePixelRatio with an SSR-safe fallback. @example getDevicePixelRatio() // 2 */
const getDevicePixelRatio = (): number => typeof window === "undefined" ? 1 : window.devicePixelRatio || 1

export default getDevicePixelRatio
