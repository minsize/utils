import parseCookies from "./parseCookies"

/** Reads a cookie by name. @example getCookie("theme") // "dark" */
const getCookie = (name: string, value?: string): string | undefined => parseCookies(value)[name]

export default getCookie
