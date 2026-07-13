import { isEmail } from "../src"
test("isEmail", () => { expect(isEmail("hi@example.com")).toBe(true); expect(isEmail("invalid")).toBe(false) })
