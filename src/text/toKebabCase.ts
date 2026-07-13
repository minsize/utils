import toWords from "./toWords"

/** Converts words to kebab-case. @example toKebabCase("user profile") // "user-profile" */
const toKebabCase = (value: string): string => toWords(value).join("-")

export default toKebabCase
