import { isAbortError } from "../src"
test("isAbortError", () => { expect(isAbortError({ name: "AbortError" })).toBe(true); expect(isAbortError(new Error())).toBe(false) })
