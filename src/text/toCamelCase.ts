import toWords from "./toWords"

/** Converts words to camelCase. @example toCamelCase("user profile") // "userProfile" */
const toCamelCase = (value: string): string => {
  const [first = "", ...rest] = toWords(value)
  return first + rest.map((word) => word[0].toLocaleUpperCase() + word.slice(1)).join("")
}

export default toCamelCase
