/** Performs a lightweight email-address validation. @example isEmail("hi@example.com") // true */
const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default isEmail
