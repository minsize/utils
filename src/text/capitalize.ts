/** Capitalizes the first character of a string. @example capitalize("utils") // "Utils" */
const capitalize = (value: string): string =>
  value ? value[0].toLocaleUpperCase() + value.slice(1) : value

export default capitalize
