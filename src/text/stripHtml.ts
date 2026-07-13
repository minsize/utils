/** Removes HTML tags from a string. @example stripHtml("<b>Hello</b>") // "Hello" */
const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, "")

export default stripHtml
