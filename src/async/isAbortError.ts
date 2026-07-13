/** Checks whether an error represents an aborted async operation. @example isAbortError({ name: "AbortError" }) // true */
const isAbortError = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { name?: unknown }).name === "AbortError"

export default isAbortError
