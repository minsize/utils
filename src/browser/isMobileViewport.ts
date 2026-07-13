/** Checks whether the current viewport is below a breakpoint. @example isMobileViewport() // true */
const isMobileViewport = (breakpoint: number = 768): boolean => typeof window !== "undefined" && window.innerWidth < breakpoint

export default isMobileViewport
