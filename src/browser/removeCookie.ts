import setCookie from "./setCookie"

/** Expires a cookie immediately. @example removeCookie("theme") */
const removeCookie = (name: string, path: string = "/"): boolean => setCookie(name, "", { path, maxAge: 0 })

export default removeCookie
