import toWords from "./toWords"

/** Converts words to snake_case. @example toSnakeCase("user profile") // "user_profile" */
const toSnakeCase = (value: string): string => toWords(value).join("_")

export default toSnakeCase
