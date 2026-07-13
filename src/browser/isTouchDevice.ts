/** Checks for touch input support. @example isTouchDevice() // true */
const isTouchDevice = (): boolean => typeof window !== "undefined" && ("ontouchstart" in window || (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0))

export default isTouchDevice
