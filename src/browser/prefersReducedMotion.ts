/** Checks the user reduced-motion preference. @example prefersReducedMotion() // false */
const prefersReducedMotion = (): boolean => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default prefersReducedMotion
