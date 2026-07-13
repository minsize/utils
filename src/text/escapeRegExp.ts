/** Escapes text for use inside a regular expression. @example escapeRegExp("a+b") // "a\\+b" */
const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

export default escapeRegExp
